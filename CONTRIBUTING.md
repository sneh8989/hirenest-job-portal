# Contributing to HireNest

Thank you for your interest in contributing to HireNest! We welcome bug reports, feature suggestions, documentation enhancements, and code contributions.

---

## Code of Conduct

Please maintain a respectful, welcoming, and inclusive environment for everyone.

---

## Development Workflow

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/HireNest.git
   cd HireNest
   ```

2. **Set up the Environment**:
   - **On Windows**:
     ```powershell
     .\scripts\setup-windows.ps1
     ```
   - **Manual Setup**:
     - Backend: Create a virtual environment in `backend/venv`, copy `.env.example` to `backend/.env`, install dependencies via `pip install -r requirements.txt`, and seed the database using `python -m app.data.seed_data`.
     - Frontend: Run `npm install` inside `frontend/`.

3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Run Automated Tests**:
   Before submitting your changes, ensure that all tests and frontend builds pass:
   ```powershell
   .\scripts\run-tests.ps1
   ```

5. **Commit and Open a Pull Request**:
   - Write clear, concise commit messages.
   - Describe your changes, motivation, and any testing performed in your PR description.

