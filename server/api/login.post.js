// api/login POST

import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { HTTP_STATUS_CODES } from "~/data/constant";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!validator.isEmail(body.email)) {
    throw createError({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Invalid email. plaease try again",
    });
  }
  if (!body.password) {
    throw createError({
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      message: "Password is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      throw createError({
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        message: "Username or password is invalid",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    console.log('gentoken', token)
    setCookie(event, "appleNote", token);

    return { data: "success" };
  } catch (err) {
    console.log("login err", err);
    throw createError({
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      statusMessage: "Internal Server Error",
      data: err,
    });
  }
});
