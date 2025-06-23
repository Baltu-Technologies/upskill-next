import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Upskill',
  description: 'Terms of Service for Upskill learning platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using Upskill ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              Upskill is an online learning platform that provides educational content, courses, and skill development resources. Our service includes:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access to educational courses and materials</li>
              <li>Progress tracking and analytics</li>
              <li>Interactive learning tools</li>
              <li>Career development resources</li>
              <li>Community features and discussions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
            <p>
              To use certain features of our Service, you must register for an account. You may register using your email address or through third-party authentication services like Google.
            </p>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Responsibility</h3>
            <p>You are responsible for:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Keeping your account information updated</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Account Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason we deem appropriate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access the Service</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service for commercial purposes without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Our Content</h3>
            <p>
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, images, and software, are owned by Upskill and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 User Content</h3>
            <p>
              You retain ownership of any content you submit to the Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display such content in connection with the Service.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 License to Use</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes in accordance with these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Billing</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Paid Services</h3>
            <p>
              Some features of our Service may require payment. Pricing and payment terms will be clearly disclosed before you make any purchase.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Refund Policy</h3>
            <p>
              Refunds are handled on a case-by-case basis. Please contact our support team if you have concerns about a purchase.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">6.3 Auto-Renewal</h3>
            <p>
              Subscription services may automatically renew unless cancelled before the renewal date. You can manage your subscription settings in your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p>
              Our Service may integrate with third-party services (such as Google for authentication). Your use of these services is subject to their respective terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>The Service will be uninterrupted or error-free</li>
              <li>The Service will meet your specific requirements</li>
              <li>Any errors will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p>
              In no event shall Upskill be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Upskill from and against any claims, damages, obligations, losses, liabilities, costs, and expenses arising from your use of the Service or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
            <p>
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. All provisions which by their nature should survive termination shall survive.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p><strong>Email:</strong> legal@upskill.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 