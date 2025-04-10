// api/user POST

import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  //hash password
  const salt = await bcrypt.genSalt(10)
  const passowrdHash = await bcrypt.hash(body.password, salt, ) 
  

  // send to DB
  await prisma.user.create({
    data: {
      email: body.email,
      password: passowrdHash,
    },
  });
  return { data: "success" };
});
