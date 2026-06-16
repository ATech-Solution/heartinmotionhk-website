'use client'

import { useState } from 'react'
import { PolicyModal } from '@/components/ui/PolicyModal'
import { RichText } from '@/components/ui/RichText'

interface PolicyGroup {
  title?: string | null
  content?: any | null
}

interface FooterPolicyLinksProps {
  privacyPolicy?: PolicyGroup | null
  termsConditions?: PolicyGroup | null
}

function FallbackPrivacyContent() {
  return (
    <>
      <div>
        <p className="font-bold mb-1">1. Information Collection</p>
        <p>
          We may collect personal information from clients, including names, contact details, and
          any other information necessary for coaching services.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">2. Use of Information</p>
        <p>The information collected will be used solely for:</p>
        <ul className="mt-1 space-y-0.5">
          <li>– Providing and managing coaching services.</li>
          <li>– Communicating regarding sessions and related services.</li>
          <li>– Improving our coaching offerings.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold mb-1">3. Confidentiality</p>
        <p>
          Client information will be kept confidential and will not be disclosed to any third
          parties without the client's consent, except as required by law.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">4. Data Security</p>
        <p>
          We take reasonable measures to protect the personal information of clients from
          unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">5. Client Rights</p>
        <p>Clients have the right to:</p>
        <ul className="mt-1 space-y-0.5">
          <li>– Request access to their personal information.</li>
          <li>– Request corrections to inaccurate information.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold mb-1">6. Changes to the Privacy Policy</p>
        <p>
          We may update this Privacy Policy from time to time. Clients will be notified of
          significant changes.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">7. Contact Us</p>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a
            href="mailto:contact@heartinmotionhk.com"
            className="underline text-blue-600 hover:text-blue-800"
          >
            contact@heartinmotionhk.com
          </a>
          .
        </p>
      </div>
    </>
  )
}

function FallbackTermsContent() {
  return (
    <>
      <div>
        <p className="font-bold mb-1">1. Acceptance of Terms</p>
        <p>
          By engaging in coaching services, clients agree to abide by these Terms and Conditions.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">2. Services Offered</p>
        <p>
          The services provided include executive coaching, leadership development, individual
          coaching, workshops, and program/change delivery, as outlined in the service description.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">3. Client Responsibilities</p>
        <p>Clients are expected to:</p>
        <ul className="mt-1 space-y-0.5">
          <li>– Attend scheduled sessions punctually and prepared.</li>
          <li>– Provide honest feedback to facilitate effective coaching.</li>
          <li>– Respect the confidentiality and privacy of all participants.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold mb-1">4. Fees and Payment</p>
        <ul className="space-y-0.5">
          <li>– Payments are due upon receipt of the invoice.</li>
          <li>– Fees are non-refundable for canceled sessions unless otherwise agreed upon.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold mb-1">5. Scheduling and Cancellations</p>
        <ul className="space-y-0.5">
          <li>– Sessions must be scheduled in advance.</li>
          <li>
            – Cancellations must be made at least 24 hours in advance to avoid being charged for
            the session.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold mb-1">6. Confidentiality</p>
        <p>
          All information shared during coaching sessions will be kept strictly confidential.
          Coaches will not disclose any client information without explicit consent, except where
          required by law.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">7. Limitation of Liability</p>
        <p>
          Heart in Motion HK is not liable for any direct, indirect, incidental, or consequential
          damages arising from the use of coaching services.
        </p>
      </div>
      <div>
        <p className="font-bold mb-1">8. Changes to Terms</p>
        <p>
          Heart in Motion HK reserves the right to update these Terms and Conditions at any time.
          Clients will be notified of any significant changes.
        </p>
      </div>
    </>
  )
}

type ModalType = 'privacy' | 'terms' | null

export function FooterPolicyLinks({ privacyPolicy, termsConditions }: FooterPolicyLinksProps) {
  const [open, setOpen] = useState<ModalType>(null)

  const privacyTitle = privacyPolicy?.title || 'Privacy policy'
  const termsTitle = termsConditions?.title || 'Terms & Conditions'

  return (
    <>
      <button
        onClick={() => setOpen('privacy')}
        className="block text-left text-[18px] text-black hover:font-bold font-normal"
      >
        Privacy Policy
      </button>
      <button
        onClick={() => setOpen('terms')}
        className="block text-left text-[18px] text-black hover:font-bold font-normal"
      >
        Terms &amp; Conditions
      </button>

      {open === 'privacy' && (
        <PolicyModal title={privacyTitle} onClose={() => setOpen(null)}>
          {privacyPolicy?.content ? (
            <RichText content={privacyPolicy.content} />
          ) : (
            <FallbackPrivacyContent />
          )}
        </PolicyModal>
      )}
      {open === 'terms' && (
        <PolicyModal title={termsTitle} onClose={() => setOpen(null)}>
          {termsConditions?.content ? (
            <RichText content={termsConditions.content} />
          ) : (
            <FallbackTermsContent />
          )}
        </PolicyModal>
      )}
    </>
  )
}
