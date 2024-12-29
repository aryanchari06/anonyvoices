import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  //   const user = session?.user
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to update accept messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User updated successfully for message acceptance status",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user status to update accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to update accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found successfully",
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching user message acceptance status");
    return Response.json(
      {
        success: false,
        message: "Error while fetching user message acceptance status",
      },
      { status: 500 }
    );
  }
}
