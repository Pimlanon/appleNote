// api/notes POST
import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "~/data/constant";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const cookies = parseCookies(event);
    const token = cookies.appleNote;

    if (!token) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        statusMessage: "Not authorized to update",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const newNote = await prisma.note.create({
      data: {
        text: body.updatedNote,
        userId: decodedToken.id,
      },
    });

    return { data: "success", context: newNote };
  } catch (err) {
    console.log("POST-notes err", err);
    throw createError({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      statusMessage: "Internal Server Error",
      data: err,
    });
  }
});
