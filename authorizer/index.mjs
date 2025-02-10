import { jwtDecode } from "jwt-decode";

export const handler = async (event) => {
  try {

    console.log(event);

    console.log({authorizationToken: event.headers.authorizationtoken})

    const token = event.headers.authorizationtoken.split(" ")[1];

    console.log({tokencapturado: token});

    const decodedToken = jwtDecode(token);

    console.log({ decodedToken : decodedToken})

    if (!decodedToken) {
      throw new Error("Token inválido");
    }

    const groups = decodedToken["cognito:groups"] || [];

    const isAllowed = ["Administrador", "Cozinha"].some(group => groups.includes(group));

    console.log({isAllowed: isAllowed})

    if (isAllowed) {
      return generatePolicy("Allow", event.routeArn, decodedToken.sub);
    } else {
      return generatePolicy("Deny", event.routeArn, "unauthorized");
    }
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    return generatePolicy("Deny", event.routeArn, "unauthorized");
  }
};

// Função auxiliar para gerar a política de autorização
const generatePolicy = (effect, resource, principalId) => {

  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    }
  };
};
