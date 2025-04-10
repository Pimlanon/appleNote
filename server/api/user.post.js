// api/user POST

import bcrypt from "bcryptjs";
import validator from "validator";
import prisma from "../utils/prisma";
import {
  HTTP_STATUS_CODES,
  PRISMA_ERROR_CODES,
} from "~/data/constant";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!validator.isEmail(body.email)) {
    throw createError({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Invalid email. plaease try again",
    });
  }
  if (
    !validator.isStrongPassword(body.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 0,
      minSymbols: 0,
    })
  ) {
    throw createError({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Password requires minimum 8 characters, include atleast 1 lowercase and 1 uppercase",
    });
  }

  try {
    //hash password
    const genSalt = await bcrypt.genSalt(10);
    const passowrdHash = await bcrypt.hash(body.password, genSalt);

    // send to DB
    await prisma.user.create({
      data: {
        email: body.email,
        password: passowrdHash,
        salt: genSalt,
      },
    });
    return { data: "success" };
  } catch (err) {
    if (err.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.CONFLICT,
        message: "An email with this address already exist",
        data: err,
      });
    }

    throw createError({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      statusMessage: "Internal Server Error",
      data: err,
    });
  }
});
