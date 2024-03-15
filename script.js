import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export const options = {
  scenarios: {
    open_model: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '3600s',
      preAllocatedVUs: 10,
    },
  },
};

const payload = JSON.stringify({
  query: `fragment User on User {
      id
      username
      name
    }

    fragment Review on Review {
      id
      body
    }

    fragment Product on Product {
      inStock
      name
      price
      shippingEstimate
      upc
      weight
    }

    query TestQuery {
      topProducts {
      ...Product
        reviews {
      ...Review
          author {
      ...User
            reviews {
      ...Review
    }
          }
        }
      }
    }
    `
});
const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function() {
  const res = http.post("http://ec2-15-236-209-233.eu-west-3.compute.amazonaws.com:4000", payload, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  const res2 = http.post("http://ec2-15-236-209-233.eu-west-3.compute.amazonaws.com:3002/graphql", payload, params);
  check(res2, {
    'status is 200': (r) => r.status === 200,
  });
}

