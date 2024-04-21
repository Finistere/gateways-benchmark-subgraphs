import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    open_model: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "10s",
      preAllocatedVUs: 100,
    },
  },
};

const payload = JSON.stringify({
  query: `
    query {
      products {
        topProducts {
          name
        }
      }
    }
    `,
});
const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export default function () {
  const res = http.post(
    "https://brabier-cruise-critic-like-grafbase.grafbase.app/graphql",
    payload,
    params,
  );
  check(res, {
    "status is 200": (r) => r.status === 200,
    "no graphql errors": (resp) => {
      const json = resp.json();
      const noErrors =
        !!json &&
        typeof json === "object" &&
        !Array.isArray(json) &&
        !json.errors;

      if (!noErrors) {
        printOnce(
          "graphql_errors",
          `‼️ Got GraphQL errors, here's a sample:`,
          res.body,
        );
      }

      return noErrors;
    },
  });
}
