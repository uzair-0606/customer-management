import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/*
|--------------------------------------------------------------------------
| GET - Get customers
|--------------------------------------------------------------------------
*/
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "EMPLOYEE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    /*
     * SUPER_ADMIN:
     * Can see all customers.
     *
     * EMPLOYEE:
     * Can only see customers created by themselves.
     */
    const where =
      session.user.role === "EMPLOYEE"
        ? {
            createdById: session.user.id,
          }
        : undefined;

    const customers = await prisma.customer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Get customers failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Create customer
|--------------------------------------------------------------------------
*/
export async function POST(request: Request) {
  try {
    const session = await auth();

    /*
     * Authentication
     */
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /*
     * Authorization
     */
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "EMPLOYEE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    /*
     * Read request body
     */
    const body = await request.json();

    const {
      firstName,
      middleName,
      lastName,
      age,
      contactNumber1,
      contactNumber2,
      email,
      address,
    } = body;

    /*
     * Validate required fields
     */
    if (
      !firstName ||
      !lastName ||
      age === undefined ||
      !contactNumber1 ||
      !email ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields are missing",
        },
        { status: 400 }
      );
    }

    /*
     * Validate age
     */
    const parsedAge = Number(age);

    if (
      !Number.isInteger(parsedAge) ||
      parsedAge <= 0 ||
      parsedAge > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid age",
        },
        { status: 400 }
      );
    }

    /*
     * Clean values
     */
    const cleanedFirstName = String(firstName).trim();

    const cleanedMiddleName = middleName
      ? String(middleName).trim()
      : null;

    const cleanedLastName = String(lastName).trim();

    const cleanedContact1 = String(contactNumber1).trim();

    const cleanedContact2 = contactNumber2
      ? String(contactNumber2).trim()
      : null;

    const cleanedEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanedAddress = String(address).trim();

    /*
     * Basic email validation
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    /*
     * Create customer in Neon/PostgreSQL
     *
     * emailStatus automatically starts as PENDING
     * because of the Prisma schema default.
     */
    const customer = await prisma.customer.create({
      data: {
        firstName: cleanedFirstName,
        middleName: cleanedMiddleName,
        lastName: cleanedLastName,
        age: parsedAge,
        contactNumber1: cleanedContact1,
        contactNumber2: cleanedContact2,
        email: cleanedEmail,
        address: cleanedAddress,

        /*
         * Automatically assign the currently
         * logged-in employee or super admin.
         */
        createdById: session.user.id,
      },
    });

    /*
     * Send confirmation email
     *
     * IMPORTANT:
     * Email failure will NOT delete or rollback
     * the customer.
     */
    try {
      /*
       * Check whether Resend is configured.
       */
      if (
        process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL
      ) {
        const fullName = [
          customer.firstName,
          customer.middleName,
          customer.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        const { error: emailError } =
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,

            to: [customer.email],

            subject:
              "Customer Registration Successful",

            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                  <title>
                    Customer Registration Successful
                  </title>
                </head>

                <body
                  style="
                    margin: 0;
                    padding: 0;
                    background-color: #f8fafc;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >

                  <div
                    style="
                      max-width: 600px;
                      margin: 40px auto;
                      background: #ffffff;
                      border: 1px solid #e2e8f0;
                      border-radius: 12px;
                      overflow: hidden;
                    "
                  >

                    <!-- Header -->
                    <div
                      style="
                        background: #2563eb;
                        padding: 24px;
                        color: white;
                      "
                    >
                      <h1
                        style="
                          margin: 0;
                          font-size: 24px;
                        "
                      >
                        Customer Management
                      </h1>

                      <p
                        style="
                          margin: 8px 0 0;
                          font-size: 14px;
                        "
                      >
                        Customer Registration
                      </p>
                    </div>

                    <!-- Content -->
                    <div
                      style="
                        padding: 32px;
                      "
                    >

                      <h2
                        style="
                          margin-top: 0;
                          color: #0f172a;
                        "
                      >
                        Welcome, ${customer.firstName}!
                      </h2>

                      <p
                        style="
                          color: #475569;
                          line-height: 1.6;
                        "
                      >
                        Your customer record has been
                        successfully created in our
                        customer management system.
                      </p>

                      <div
                        style="
                          margin-top: 24px;
                          padding: 20px;
                          background: #f8fafc;
                          border-radius: 8px;
                          border: 1px solid #e2e8f0;
                        "
                      >

                        <h3
                          style="
                            margin-top: 0;
                            color: #0f172a;
                          "
                        >
                          Customer Details
                        </h3>

                        <p
                          style="
                            margin: 8px 0;
                            color: #475569;
                          "
                        >
                          <strong>Name:</strong>
                          ${fullName}
                        </p>

                        <p
                          style="
                            margin: 8px 0;
                            color: #475569;
                          "
                        >
                          <strong>Email:</strong>
                          ${customer.email}
                        </p>

                        <p
                          style="
                            margin: 8px 0;
                            color: #475569;
                          "
                        >
                          <strong>Contact:</strong>
                          ${customer.contactNumber1}
                        </p>

                        <p
                          style="
                            margin: 8px 0;
                            color: #475569;
                          "
                        >
                          <strong>Age:</strong>
                          ${customer.age}
                        </p>

                        <p
                          style="
                            margin: 8px 0;
                            color: #475569;
                          "
                        >
                          <strong>Address:</strong>
                          ${customer.address}
                        </p>

                      </div>

                      <p
                        style="
                          margin-top: 28px;
                          color: #64748b;
                          font-size: 14px;
                          line-height: 1.6;
                        "
                      >
                        If you have any questions,
                        please contact our team.
                      </p>

                    </div>

                    <!-- Footer -->
                    <div
                      style="
                        padding: 20px 32px;
                        background: #f8fafc;
                        border-top: 1px solid #e2e8f0;
                        color: #94a3b8;
                        font-size: 12px;
                      "
                    >
                      This is an automated email.
                      Please do not reply directly
                      to this message.
                    </div>

                  </div>

                </body>
              </html>
            `,
          });

        /*
         * EMAIL FAILED
         */
        if (emailError) {
          console.error(
            "Resend email error:",
            emailError
          );

          await prisma.customer.update({
            where: {
              id: customer.id,
            },
            data: {
              emailStatus: "FAILED",
            },
          });
        } else {
          /*
           * EMAIL SENT SUCCESSFULLY
           */
          await prisma.customer.update({
            where: {
              id: customer.id,
            },
            data: {
              emailStatus: "SENT",
            },
          });

          console.log(
            `Customer confirmation email sent to ${customer.email}`
          );
        }
      } else {
        /*
         * EMAIL CONFIGURATION MISSING
         */
        console.warn(
          "Resend email not configured. Customer was created without sending an email."
        );

        await prisma.customer.update({
          where: {
            id: customer.id,
          },
          data: {
            emailStatus: "FAILED",
          },
        });
      }
    } catch (emailError) {
      /*
       * Unexpected email failure.
       *
       * Customer creation should NOT fail
       * because of email failure.
       */
      console.error(
        "Customer confirmation email failed:",
        emailError
      );

      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          emailStatus: "FAILED",
        },
      });
    }

    /*
     * Fetch the customer again after the email
     * status has been updated.
     *
     * This ensures the API response contains
     * SENT or FAILED instead of the original
     * PENDING value.
     */
    const updatedCustomer =
      await prisma.customer.findUnique({
        where: {
          id: customer.id,
        },
      });

    /*
     * Return successful response
     */
    return NextResponse.json(
      {
        success: true,
        customer: updatedCustomer,
        message:
          "Customer created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create customer failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create customer",
      },
      { status: 500 }
    );
  }
}