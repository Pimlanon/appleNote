// api/notes return all the notes

export default defineEventHandler(async (event) => {
    try {
        const notes = await prisma.note.findMany({
            // data: {
            //   email: body.email,
            //   password: passowrdHash,
            //   salt: genSalt,
            // },
          });

          console.log('notes', notes)

          return notes
        
    } catch (err) {
        console.log('alll note api', err)
    }
}) 