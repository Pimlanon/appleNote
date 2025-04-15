// api/notes/[id] PATCH
import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "~/data/constant";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, "id"); // this 'id' samr as filename [id].js
    console.log("id", id);

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
        id: Number(id)
      }
    })

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

    await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        text: body.updatedNote,
      },
    });
  } catch (err) {
    console.log("POST-notes/id err", err);
  }
});
