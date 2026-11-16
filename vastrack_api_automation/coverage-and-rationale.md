# Task B: Coverage and Rationale

## Coverage and Rationale

I decided to focus on wallet top-ups and the happy path of the delivery lifecycle, covering delivery creation, courier acceptance, package pickup, and delivery completion.

These areas represent the core business operations of the platform, particularly how money moves between the business and the courier.

For wallet top-ups, I want to verify that funds are added correctly and that invalid amounts, such as zero or negative values, are rejected.

For the delivery flow, I want to ensure that a business can successfully create and publish a delivery, a courier can accept and complete it, and the correct wallet deductions and courier payments are processed.

I prioritised these scenarios because failures in either area could directly affect financial transactions and the platform's ability to fulfil deliveries.

## How the collection maps to this

| Folder                               | Requests | What it checks                                                                                    |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| 0. Setup                             | 2        | Logs in as a business and a courier and stores the tokens for the other requests.                 |
| 1. Wallet top-up (positive)          | 2        | The balance before the top-up, then a valid top-up, and that the balance increases correctly.     |
| 2. Delivery journey (happy path)     | 8        | Quote, create, publish, accept, pick up, get the delivery code, deliver, and the tracking history. |
| 3. Wallet top-up negative cases      | 2        | A negative amount is rejected, and a top-up without a token is rejected.                          |

The collection has 14 requests in total: 2 setup requests that only provide tokens, and 12 test requests.

## Why these areas

- **Money is the highest risk.** The platform charges the business, pays the courier 80% of the fee, and refunds cancelled deliveries. A wallet bug costs real money and trust, so the wallet gets the most assertions.
- **The happy path proves the whole chain works.** If creation, publishing, acceptance, pickup or delivery is broken, nothing else matters. Running the full journey in order also shows that the fee is held on acceptance and settled on completion.
- **Negative top-ups protect the balance.** A wallet that accepts an invalid amount can be reduced or corrupted by one bad request, so invalid amounts and a missing token are checked.

## Not covered in the collection (and why)

- Cancellation and refund, repeated calls to the accept endpoint, and webhooks are not in the collection. I chose to go deeper on the wallet and the happy path rather than wider.
- A top-up of zero is not yet a separate request in the collection. It is the first thing I would add with more time.
