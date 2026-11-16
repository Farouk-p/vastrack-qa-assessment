# **TASK E : QA Reasoning**

**1. A release is two days away and you have one day of testing time. How do you decide what to test?**

I would use a risk-based testing approach. Depending on what the release entails, I'll prioritize features that have the highest business impact, especially features like authentication, wallets, money movement and features that are most likely to fail.
I would focus on testing positive and negative scenarios around these flows, including boundary conditions and API validations. I would also perform regression testing on related functionalities to identify unintended side effects.
My goal would be to provide stakeholders with enough information to make an informed release decision.

**2. How would you test the wallet so a business is never debited twice for one delivery?**

I would focus on testing transaction integrity, idempotency, and concurrency.

First, I would verify that accepting a delivery deducts the correct amount only once. I would then simulate duplicate requests by sending the same acceptance request multiple times and confirm that only one transaction is recorded.

I would also simulate concurrent requests (load test), network timeouts, retries, and situations where the API processes a transaction but the client does not receive the response.
I would inspect the transaction history and wallet balance to confirm that duplicate requests do not result in additional deductions. I would also verify that cancellations trigger only one refund and completed deliveries result in only one final settlement.
Finally, I would check that each transaction has a unique reference or idempotency key to prevent duplicate processing on the database.

**3. How would you put your automated tests into a CI/CD pipeline?**

Since my automation code is already pushed to GitHub, I would integrate it into a CI/CD pipeline using GitHub Actions.
I would approach it in the following steps:

1. Create a workflow: Set up a GitHub Actions workflow file inside .github/workflows in my repository.
2. Configure triggers: Configure the workflow to run automatically whenever code is pushed or a pull request is created.
3. Set up the environment: Configure the required Node.js version, install dependencies and start the sandbox application.
4. Execute automated tests: Configure the pipeline to run my existing Playwright tests against the application.
5. Generate test reports: Ensure test results, screenshots and logs are saved as artifacts, especially when tests fail.
