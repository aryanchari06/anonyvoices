import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyCodeSchema = z.object({
  verifyCode: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to obtain a new verification code!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code is incorrect",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
