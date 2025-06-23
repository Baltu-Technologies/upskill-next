import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Upskill',
  description: 'Privacy Policy for Upskill learning platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Upskill ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our learning platform and services.
            </p>
            <p>
              By using our service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Name and email address</li>
              <li>Profile information (when provided)</li>
              <li>Learning preferences and goals</li>
              <li>Course progress and completion data</li>
              <li>Account credentials (securely encrypted)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Third-Party Authentication</h3>
            <p>
              When you sign in using Google OAuth, we receive basic profile information including your name, email address, and profile picture as permitted by your Google account settings.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Usage Information</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and interaction data</li>
              <li>Performance and error logs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide and maintain our learning platform</li>
              <li>Personalize your learning experience</li>
              <li>Track your progress and achievements</li>
              <li>Send important updates and notifications</li>
              <li>Improve our services and develop new features</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Service providers:</strong> With trusted third parties who assist in operating our platform</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure hosting infrastructure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p>
              Our platform may integrate with third-party services (such as Google OAuth). These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Users</h2>
            <p>
              If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p><strong>Email:</strong> privacy@upskill.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 