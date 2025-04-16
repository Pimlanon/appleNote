
export default defineNuxtRouteMiddleware(async (event) => {
  //if (process.client) return; // true : you're running in the browser (client)
  //  do nothing on the client-side or don't run the rest of this middleware on the client
  //  

  const jwtCookie = useCookie("appleNote");
  const jwtValue = typeof jwtCookie === 'string' ? jwtCookie : jwtCookie.value;

  if (!jwtValue) {
    return navigateTo("/login");
  }

  if (import.meta.server) {
    // server-only code
    const { $verifyJwtToken } = useNuxtApp();
    try {
      await $verifyJwtToken(jwtValue, process.env.JWT_SECRET);
    } catch (err) {
      console.log("JWT verify error", err);
      return navigateTo("/login");
    }
  }

});
