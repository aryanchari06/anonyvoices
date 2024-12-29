import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  
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

  try {
    const updatedUser = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: {
          messages: { _id: messageId },
        },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or has already been deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting message", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
