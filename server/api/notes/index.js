// api/notes return all the notes
import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "~/data/constant";

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event)
    const token = cookies.appleNote;

    if (!token) {
        throw createError({
            statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
            statusMessage: 'Not authorized to access notes'
        })
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

    const notes = await prisma.note.findMany({
        where: {
            userId : decodedToken.id
        }
    });

    return notes;
  } catch (err) {
    console.log("alll note api", err);
  }
});
