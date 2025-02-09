const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  try {
    const token = event.authorizationToken.split(" ")[1];

    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      throw new Error("Token inválido");
    }

    const groups = decodedToken.payload["cognito:groups"] || [];
    const isAllowed = ["Administrador", "Cozinha"].some(group => groups.includes(group));

    if (isAllowed) {
      return generatePolicy("Allow", event.methodArn, decodedToken.payload.sub);
    } else {
      return generatePolicy("Deny", event.methodArn, "unauthorized");
    }
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    return generatePolicy("Deny", event.methodArn, "unauthorized");
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
    },
  };
};
