# 🛡️ SafeNana

A prototype check-in and safety coordination tool for older adults and their families, built after my grandmother nearly lost her savings to a phone scammer.

> **Status: prototype.** Not an emergency service and does not contact emergency services. There is no login yet, so please use demo data only.

---

## 📱 What It Does Today

**Older adult screen** (three large buttons, in traffic-light order: red, amber, green)
- 🔴 I Need Help: records a help request, then shows a one-tap call to the family contact and a one-tap call to the local emergency number (chosen from the phone's region, default 112)
- 🟠 I Got a Suspicious Message: asks who sent it (unknown number, message from WhatsApp, someone I know, or I'm not sure) and records the report
- 🟢 I'm Okay Today: records a daily check-in

**Accessibility features**
- Large, high-contrast buttons (text contrast of about 7:1 or better, to be verified with a contrast checker)
- Plain, literal wording: "Back to choices", plus an "All done, press your phone's Home button" note and a Close button
- Optional vibration feedback, with an on/off switch
- Layout tested to fit a 375x667 phone screen without scrolling on the "Who sent it?" screen
- Honest failure messages: if a request does not reach the server, the app says "Not sent"

**Family dashboard**
- Today's check-in status and a 7-day summary
- Activity feed (refreshes every 10 seconds)
- Suspicious message reports
- Settings for the person's name and a family contact

---

## 🚧 Not Built Yet

- SMS, email and push alerts to family
- User accounts and secure login
- Escalation to a backup contact
- Multiple residents and caregivers
- Automatic missed check-in alerts
- PDF/CSV reports

## ⚠️ Known Limits

- **Vibration** works on most Android browsers with touch vibration turned on in the phone settings. iPhone browsers do not support it, so iPhone users get visual confirmation only.
- **Language:** the app is in English only. Browser auto-translate can change wording and gender forms, so official translations (with native-speaker review) will be added on request.
- **Emergency number** is guessed from the phone's region. A per-person setting is planned.
- **No smartwatch version** yet.

---

## 🚀 Live Demo (demo data only)

- 👵 [Elderly Interface](https://safe-nana-frontend.vercel.app/elderly)
- 👨‍👩‍👧 [Family Dashboard](https://safe-nana-frontend.vercel.app/dashboard)

---

## 🛠️ Built With

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB
- **Hosting:** Vercel (frontend), Render (backend)

---

## 👥 User Testing

SafeNana was tested informally with **29 older adults in Lahore, Pakistan**, between **May and July 2026**.

- Some participants used the app on their own; others needed help from me.
- Feedback was collected verbally. This was not a formal study.
- **23 of the 29** gave an informal spoken rating, averaging about **8 out of 10**.

This is early feedback from a small group in one city. I have not yet tested with older adults in the US, UK or EU, which is the next step.

---

## 🔒 Privacy

See the Privacy page in the app. Please do not enter real personal data in the prototype.

---

## 📬 Contact

Kains Faisal Masih · kains.faisal22@outlook.com

---

## 📖 The Story

> *"Beta, agar galti ho gayi toh? (Son, what if a mistake happens?)"* — my grandmother's question became my design brief.
> **Dignity is the only metric.**