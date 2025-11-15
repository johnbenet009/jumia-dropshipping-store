# Contributing to Jumia Dropshipping Store

First off, thank you for considering contributing to this project! 🎉

This document provides guidelines for contributing to the Jumia Dropshipping Store project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Possible implementation** if you have ideas
- **Examples** from other projects if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues for beginners
- `help wanted` - Issues that need attention
- `documentation` - Documentation improvements

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/jumia-dropshipping-store.git
   cd jumia-dropshipping-store
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd FRONTEND && npm install && cd ..
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   cp FRONTEND/.env.example FRONTEND/.env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd FRONTEND && npm run dev
   ```

## 🔄 Pull Request Process

### 1. Create a Branch

Use descriptive branch names:

```bash
# For new features
git checkout -b feature/add-payment-gateway

# For bug fixes
git checkout -b fix/cart-quantity-bug

# For documentation
git checkout -b docs/update-readme
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Test manually in the browser
- Check both light and dark modes
- Test on mobile devices
- Ensure no console errors

### 4. Commit Your Changes

Follow the [commit message guidelines](#commit-message-guidelines):

```bash
git add .
git commit -m "Add: Paystack payment integration"
```

### 5. Push to Your Fork

```bash
git push origin feature/add-payment-gateway
```

### 6. Create Pull Request

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Link related issues

### 7. Code Review

- Respond to feedback promptly
- Make requested changes
- Push updates to the same branch
- Be patient and respectful

## 💻 Coding Standards

### JavaScript/TypeScript

- Use **ES6+** syntax
- Use **const** and **let**, avoid **var**
- Use **arrow functions** for callbacks
- Use **async/await** instead of promises chains
- Add **JSDoc comments** for functions

```javascript
/**
 * Calculates profit margin for a product
 * @param {number} price - Original price
 * @param {number} margin - Profit margin percentage
 * @returns {number} Final price with profit
 */
const calculatePrice = (price, margin) => {
  const profit = Math.round(price * (margin / 100));
  return price + Math.min(profit, 20000);
};
```

### React/TypeScript

- Use **functional components** with hooks
- Use **TypeScript** for type safety
- Keep components **small and focused**
- Extract reusable logic into **custom hooks**
- Use **meaningful prop names**

```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Component logic
};
```

### CSS/Tailwind

- Use **Tailwind CSS** utility classes
- Follow **mobile-first** approach
- Use **dark mode** variants
- Keep custom CSS minimal

```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

### File Organization

```
FRONTEND/src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── services/      # API services
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## 📝 Commit Message Guidelines

### Format

```
Type: Brief description

Detailed description (optional)

Fixes #123
```

### Types

- **Add:** New feature or functionality
- **Fix:** Bug fix
- **Update:** Update existing feature
- **Remove:** Remove code or files
- **Refactor:** Code refactoring
- **Docs:** Documentation changes
- **Style:** Code style changes (formatting)
- **Test:** Adding or updating tests
- **Chore:** Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "Add: Paystack payment integration"
git commit -m "Fix: Cart quantity not updating correctly"
git commit -m "Update: Improve mobile responsiveness"
git commit -m "Docs: Add deployment guide to README"

# Bad commits
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "asdfasdf"
```

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### High Priority
1. **Payment Gateway Integration**
   - Paystack
   - Flutterwave
   - Stripe

2. **Order Management**
   - Order dashboard
   - Status tracking
   - Order history

3. **Telegram Notifications**
   - New order alerts
   - Bot integration

### Medium Priority
1. **Admin Dashboard**
   - Sales analytics
   - Profit tracking

2. **Email Notifications**
   - Order confirmations
   - Shipping updates

3. **User Authentication**
   - Registration/Login
   - User profiles

## ❌ What NOT to Contribute

- **Breaking changes** without discussion
- **Large refactors** without prior approval
- **New dependencies** without justification
- **Unrelated features** outside project scope
- **Copyrighted content** or proprietary code

## 🔍 Code Review Criteria

Your PR will be reviewed based on:

- ✅ **Functionality** - Does it work as intended?
- ✅ **Code Quality** - Is it clean and maintainable?
- ✅ **Performance** - Does it impact performance?
- ✅ **Security** - Are there security concerns?
- ✅ **Documentation** - Is it well documented?
- ✅ **Testing** - Has it been tested?
- ✅ **Style** - Does it follow coding standards?

## 🐛 Bug Fix Checklist

- [ ] Bug is reproducible
- [ ] Root cause identified
- [ ] Fix implemented
- [ ] Tested manually
- [ ] No new bugs introduced
- [ ] Related documentation updated

## ✨ Feature Checklist

- [ ] Feature discussed in issue first
- [ ] Implementation matches requirements
- [ ] Works on desktop and mobile
- [ ] Works in light and dark mode
- [ ] No console errors or warnings
- [ ] Documentation updated
- [ ] Examples provided (if applicable)

## 📞 Getting Help

- **Questions?** Open a [Discussion](https://github.com/johnbenet009/jumia-dropshipping-store/discussions)
- **Stuck?** Comment on your PR or issue
- **Ideas?** Open an issue to discuss

## 🙏 Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute! 🎉

---

**Happy Coding!** 💻✨
