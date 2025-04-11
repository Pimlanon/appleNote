export default defineNuxtRouteMiddleware(async (event) => {
  if (process.client) return; // true : you're running in the browser (client)
  //  "Don't run the rest of this middleware on the client."

  console.log("middleware");
  const { $verifyJwtToken } = useNuxtApp();
  const jwtValue = useCookie("appleNote");

  if (!jwtValue) {
    return navigateTo("/register");
  }

  try {
    await $verifyJwtToken(jwtValue, process.env.JWT_SECRET);
  } catch (err) {
    console.log("auth err", err);
    return navigateTo("/register");
  }
});
