# Bug Reports

## BUG-01: Wallet top-up accepts a negative amount and reduces the balance

### Bug description

The wallet top-up endpoint (`POST /api/v1/wallet/top-up`) does not validate the sign of the `amount` field. When a negative amount is sent, the API accepts it with `201 Created` and reduces the wallet balance by that amount instead of rejecting the request. A top-up endpoint should only add funds, so this lets a user debit their own wallet through a funding endpoint, and the balance can even go below zero.

| Field           | Value                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Component**   | Business Wallet, `POST /api/v1/wallet/top-up`                                                                                   |
| **Environment** | Vastrack QA sandbox Environment, run locally (`http://localhost:4000`), tested with Postman. Account: `business2@sandbox.test`. |
| **Severity**    | High                                                                                                                            |
| **Priority**    | High                                                                                                                            |
| **Type**        | Functional / input validation (hypothesis: missing check on the sign of `amount`)                                               |

### Steps to reproduce

1. `POST /api/v1/auth/login` as `business2@sandbox.test` / `Password123!` and copy the `token`.
2. `GET /api/v1/wallet` with `Authorization: Bearer <token>`. The balance is `50000`.
3. `POST /api/v1/wallet/top-up` with `Authorization: Bearer <token>` and body:
   ```json
   { "amount": -5 }
   ```
4. `GET /api/v1/wallet` again.

### Expected result

- The API rejects the request with **HTTP 400 Bad Request**.
- The response body uses the same error format as the other validation errors, with the message **"Amount cannot be a negative value"**:
  ```json
  {
    "error": {
      "code": "validation_error",
      "message": "Amount cannot be a negative value"
    }
  }
  ```
- The wallet balance does not change.

### Actual result

- The API returns **HTTP 201 Created**.
- The balance is **reduced** by the absolute value of the amount: `51149` becomes `51144` for `-5`.
- No validation error is returned.

### Screen Recording

https://jam.dev/c/781ad9e4-4670-4b3a-a99b-65b0c89f888a

### Why this severity and priority

**Severity: Critical**
This is critical because it affects the Wallet and can lead to unintended debit.

**Priority: High**
This is of high priority because it directly affects a core financial feature.

---

## BUG-02: Accepting an already accepted delivery keeps adding "assigned" entries to the tracking history

### Bug description

The courier accept endpoint (`POST /api/v1/courier/deliveries/{deliveryId}/accept`) does not reject repeated calls. After a courier has accepted a delivery and it is assigned to them, calling the same endpoint again is accepted again and a new `assigned` entry is added to the delivery history every time. The API should recognise that the delivery is already assigned to the courier and return a message saying so, without changing the history.

| Field           | Value                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Component**   | Courier deliveries, `POST /api/v1/courier/deliveries/{deliveryId}/accept`                              |
| **Environment** | Vastrack QA sandbox Environment, run locally (`http://localhost:4000`), tested with Postman. Role: courier. |
| **Severity**    | Medium                                                                                                 |
| **Priority**    | Medium                                                                                                 |
| **Type**        | Functional / state handling (hypothesis: missing check that the delivery is already assigned)          |

### Steps to reproduce

1. Log in as a courier with `POST /api/v1/auth/login` and copy the `token`.
2. Have a business create and publish a delivery so its status is `pending`.
3. `POST /api/v1/courier/deliveries/{deliveryId}/accept` with `Authorization: Bearer <courier token>`. The delivery is assigned to the courier.
4. Call the same `POST /api/v1/courier/deliveries/{deliveryId}/accept` request again, one or more times.
5. `GET /api/v1/deliveries/{deliveryId}/tracking` as the business and check the history.

### Expected result

- The first call assigns the delivery to the courier.
- On every subsequent call, the API rejects the request with a message showing that the courier has already been assigned to the delivery.
- The delivery history is not changed by the repeated calls.

### Actual result

- The repeated calls are accepted.
- The history keeps getting populated with the `assigned` status, one extra entry for each call, showing that the courier is assigned to the delivery again.
- No message is returned to say the courier is already assigned.

### Screen Recording

To be added.

### Why this severity and priority

**Severity: Medium**
The delivery still reaches the courier, but the history becomes inaccurate and could confuse support, auditing and tracking shown to the business.

**Priority: Medium**
The fix is small (check the delivery status before assigning), but it does not block the core flow, so it can be fixed after the money-related bug.
