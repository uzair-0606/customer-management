import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/*
|--------------------------------------------------------------------------
| GET - Get all employees
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

    /*
     * Only SUPER_ADMIN can manage employees
     */
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const employees =
      await prisma.employee.findMany({
        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error(
      "Get employees failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Create employee
|--------------------------------------------------------------------------
*/
export async function POST(
  request: Request
) {
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
    if (session.user.role !== "SUPER_ADMIN") {
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
      name,
      email,
      password,
      phone,
    } = body;

    /*
     * Validate required fields
     */
    if (
      !name ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    /*
     * Clean values
     */
    const cleanedName =
      String(name).trim();

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const cleanedPhone = phone
      ? String(phone).trim()
      : null;

    const plainPassword =
      String(password);

    /*
     * Validate name
     */
    if (cleanedName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    /*
     * Validate email
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    /*
     * Validate password
     */
    if (plainPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    /*
     * Check whether employee already exists
     */
    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An employee with this email already exists",
        },
        { status: 409 }
      );
    }

    /*
     * Hash password
     */
    const passwordHash =
      await bcrypt.hash(
        plainPassword,
        10
      );

    /*
     * Create employee
     *
     * Password is NEVER returned
     * from this API.
     */
    const employee =
      await prisma.employee.create({
        data: {
          name: cleanedName,

          email: normalizedEmail,

          passwordHash,

          phone: cleanedPhone,

          role: "EMPLOYEE",

          status: "ACTIVE",
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

    /*
     * Send employee welcome email
     *
     * IMPORTANT:
     * Email failure does NOT undo
     * employee creation.
     */
    try {
      if (
        process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL
      ) {
        const {
          data: emailData,
          error: emailError,
        } =
          await resend.emails.send({
            from:
              process.env
                .RESEND_FROM_EMAIL,

            to: [employee.email],

            subject:
              "Your Employee Account Has Been Created",

            html: `
              <!DOCTYPE html>

              <html>

                <head>

                  <meta
                    charset="UTF-8"
                  />

                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />

                  <title>
                    Employee Account Created
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
                        padding: 28px;
                        color: #ffffff;
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
                        Employee Portal
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
                        Welcome,
                        ${employee.name}!
                      </h2>

                      <p
                        style="
                          color: #475569;
                          line-height: 1.6;
                        "
                      >
                        Your employee account has
                        been successfully created.
                        You can now log in to the
                        Customer Management system.
                      </p>


                      <!-- Account Details -->

                      <div
                        style="
                          margin-top: 24px;
                          padding: 20px;
                          background: #f8fafc;
                          border: 1px solid #e2e8f0;
                          border-radius: 8px;
                        "
                      >

                        <h3
                          style="
                            margin-top: 0;
                            color: #0f172a;
                          "
                        >
                          Account Details
                        </h3>

                        <p
                          style="
                            margin: 10px 0;
                            color: #475569;
                          "
                        >
                          <strong>
                            Name:
                          </strong>

                          ${employee.name}
                        </p>

                        <p
                          style="
                            margin: 10px 0;
                            color: #475569;
                          "
                        >
                          <strong>
                            Email:
                          </strong>

                          ${employee.email}
                        </p>

                        <p
                          style="
                            margin: 10px 0;
                            color: #475569;
                          "
                        >
                          <strong>
                            Role:
                          </strong>

                          Employee
                        </p>

                        <p
                          style="
                            margin: 10px 0;
                            color: #475569;
                          "
                        >
                          <strong>
                            Status:
                          </strong>

                          Active
                        </p>

                      </div>


                      <!-- Login Details -->

                      <div
                        style="
                          margin-top: 24px;
                          padding: 20px;
                          background: #eff6ff;
                          border: 1px solid #bfdbfe;
                          border-radius: 8px;
                        "
                      >

                        <h3
                          style="
                            margin-top: 0;
                            color: #1e3a8a;
                          "
                        >
                          Login Information
                        </h3>

                        <p
                          style="
                            color: #334155;
                            line-height: 1.6;
                          "
                        >
                          Use the email address
                          registered above and the
                          password provided to you by
                          your administrator.
                        </p>

                        <p
                          style="
                            color: #dc2626;
                            font-size: 13px;
                            line-height: 1.6;
                          "
                        >
                          For security reasons,
                          your password is not included
                          in this email.
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
                        If you did not expect this
                        account, please contact your
                        administrator.
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

        if (emailError) {
          console.error(
            "Employee welcome email failed:",
            emailError
          );
        } else {
          console.log(
            "Employee welcome email sent:",
            emailData
          );
        }
      } else {
        console.warn(
          "Resend is not configured. Employee created without email."
        );
      }
    } catch (emailError) {
      /*
       * Employee creation remains
       * successful even if email fails.
       */
      console.error(
        "Employee email exception:",
        emailError
      );
    }

    /*
     * Return employee
     */
    return NextResponse.json(
      {
        success: true,
        employee,
        message:
          "Employee created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create employee failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create employee",
      },
      { status: 500 }
    );
  }
}