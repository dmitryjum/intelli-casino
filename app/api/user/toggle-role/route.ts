import { prisma } from "@/lib/db"
import { Role } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth"
import { NextResponse } from "next/server"
import { ZodError } from "zod";

export async function POST() {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to perform this action." },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      )
    }

    const newRole = user.role === Role.PLAYER ? Role.SPECTATOR : Role.PLAYER

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
    })

    return NextResponse.json({ role: updatedUser.role })
  } catch(error: any) {
    if(error instanceof ZodError) {
      return NextResponse.json(
        {error: error.issues},
        {status: 400}
      )
    }
  }
}
