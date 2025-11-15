import { Heart, Users, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About ShopFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the best products at amazing prices.
            Our mission is to make online shopping simple, enjoyable, and accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To revolutionize online shopping by offering carefully curated products
              that combine quality, value, and style. We believe everyone deserves access
              to premium products without the premium price tag.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-700 leading-relaxed">
              Quality first, customer always. We stand behind every product we sell
              and are committed to providing an exceptional shopping experience from
              browsing to delivery and beyond.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-12 mb-16 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose ShopFlow?</h2>
            <p className="text-lg text-primary-50 leading-relaxed mb-8">
              We're more than just another online store. We're a team dedicated to
              making your shopping experience seamless, secure, and satisfying every step of the way.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-primary-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-primary-100">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-100">Customer Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
            <p className="text-gray-600 leading-relaxed">
              Your satisfaction is our top priority. We're here to help with any questions
              or concerns you might have.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Award className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h3>
            <p className="text-gray-600 leading-relaxed">
              Every product is carefully selected and tested to ensure it meets our
              high standards of quality.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Built with Care</h3>
            <p className="text-gray-600 leading-relaxed">
              From sourcing to shipping, every step is handled with attention to detail
              and genuine care.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-sm p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Discover our collection of premium products and experience the ShopFlow difference today.
          </p>
          <button className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors">
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}

