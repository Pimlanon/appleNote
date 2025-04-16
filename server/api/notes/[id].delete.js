// api/notes/[id] DELETE

import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "~/data/constant";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const cookies = parseCookies(event);
    const token = cookies.appleNote;

    if (!token) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        statusMessage: "Not authorized to update",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const targetNote = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!targetNote) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        statusMessage: "Note does not exist",
      });
    }

    if (targetNote.userId !== decodedToken.id) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        statusMessage: "Does not have permission to update note",
      });
    }

    await prisma.note.delete({
      where: {
        id: Number(id),
      },
    });

    return { data: "success" };
  } catch (err) {
    console.log("DELETE-notes/id err", err);
    throw createError({
        statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: "Internal Server Error",
        data: err,
      });
  }
});
