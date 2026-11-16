# Task B: Coverage and Rationale

## Coverage and Rationale

I decided to focus on wallet top-ups and the happy path of the delivery lifecycle, covering delivery creation, courier acceptance, package pickup, and delivery completion.

These areas represent the core business operations of the platform, particularly how money moves between the business and the courier.

For wallet top-ups, I want to verify that funds are added correctly and that invalid amounts, such as zero or negative values, are rejected.

For the delivery flow, I want to ensure that a business can successfully create and publish a delivery, a courier can accept and complete it, and the correct wallet deductions and courier payments are processed.

I prioritised these scenarios because failures in either area could directly affect financial transactions and the platform's ability to fulfil deliveries.

## How the collection maps to this

| Folder                           | Requests | What it checks                                                                                     |
| -------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| 0. Setup                         | 2        | Logs in as a business and a courier and stores the tokens for the other requests.                  |
| 1. Wallet top-up (positive)      | 2        | The balance before the top-up, then a valid top-up, and that the balance increases correctly.      |
| 2. Delivery journey (happy path) | 8        | Quote, create, publish, accept, pick up, get the delivery code, deliver, and the tracking history. |
| 3. Wallet top-up negative cases  | 2        | A negative amount is rejected, and a top-up without a token is rejected.                           |

The collection has 14 requests in total: 2 setup requests that only provide tokens, and 12 test requests.
