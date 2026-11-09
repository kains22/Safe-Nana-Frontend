import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem', lineHeight: 1.6 }}>
      <h1>Privacy Notice</h1>
      <p><em>SafeNana is a prototype. Last updated: 9 November 2026.</em></p>

      <h2>What SafeNana is</h2>
      <p>
        SafeNana is an early prototype of a check-in and safety coordination tool.
        It is not an emergency service and does not contact emergency services.
        In an emergency, call your local emergency number.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>The name you enter for the person being supported.</li>
        <li>A family contact name and phone number, if you enter them.</li>
        <li>Activity records: check-ins, help requests, suspicious-message reports, and messages.</li>
      </ul>
      <p>
        In this prototype there are no user accounts or login yet, so please do not
        enter real personal data. Use made-up names and numbers.
      </p>

      <h2>How it is used</h2>
      <p>
        Data is used only to show the check-in dashboard. We do not sell it or use it for advertising.
      </p>

      <h2>Where it is stored</h2>
      <p>
        Data is stored in a MongoDB database and served by our hosting providers.
        A full list of providers and storage regions will be published before any pilot.
      </p>

      <h2>Deleting your data</h2>
      <p>
        To ask for your data to be deleted, email{' '}
        <a href="mailto:kains.faisal22@outlook.com">kains.faisal22@outlook.com</a>.
      </p>

      <p><Link to="/dashboard">← Back to dashboard</Link></p>
    </main>
  )
}