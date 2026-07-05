import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';

export async function downloadAcademicReportDocx(): Promise<void> {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'EEEEEE' }
  };

  const doc = new Document({
    creator: 'Course 428 Software Developers & Trust Analysts',
    title: 'SmartTrade Africa Ltd - Final Academic & Technical Report',
    description: 'Comprehensive design and implementation report for secure, trusted e-commerce system with TCP Enclave, WebAuthn Biometrics, TCRA Escrow, and TAM/UTAUT framework.',
    sections: [
      {
        properties: {},
        children: [
          // Title Page
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 300 },
            children: [
              new TextRun({
                text: 'COURSE 428: TRUST MANAGEMENT IN E-COMMERCE',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'FINAL ACADEMIC & TECHNICAL ARCHITECTURE REPORT',
                bold: true,
                size: 36,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'System Solution: SmartTrade Africa Secure Digital Platform',
                italics: true,
                size: 24,
                color: '334155'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1000 },
            children: [
              new TextRun({
                text: 'Integrating Trusted Computing Platform (TCP), FIDO2/WebAuthn Fingerprint Biometrics, TCRA Regulatory Escrow APIs, and TAM/UTAUT Adoption Principles',
                size: 20,
                color: '475569'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Prepared by: Software Development & Trust Analysis Team',
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({
                text: `Date of Publication: July 2026 | Target Client: SmartTrade Africa Ltd`,
                size: 20,
                color: '64748B'
              })
            ]
          }),

          // Page Break / Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 600, after: 300 },
            children: [new TextRun({ text: 'Executive Summary', bold: true, size: 28, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'SmartTrade Africa Ltd recently experienced significant security bottlenecks and consumer trust hurdles, including fraudulent account creation, payment interception vectors, unauthorized access attempts, and data privacy apprehensions. To resolve these vulnerabilities and establish an unassailable digital commerce marketplace across web and mobile touchpoints, our engineering and trust analysis team developed a holistic full-stack platform. This report provides the definitive architectural blueprint, security proofs, and behavioral acceptance justification for the platform developed for Course 428.'
              })
            ]
          }),

          // Chapter 1: Threat Analysis
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '1. Problem Statement & E-Commerce Threat Analysis', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'In emerging digital marketplaces, consumer trust is directly coupled to technological reliability and security guarantees (Grandison & Sloman, 2000). SmartTrade Africa encountered six primary threat domains that impeded consumer adoption:'
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Threat Domain', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Platform Vulnerability Impact', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Implemented Engineered Mitigation', bold: true, color: 'FFFFFF' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fake Customer Accounts', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sybil attacks and bots generating automated accounts for abuse.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hardware-level device attestation via WebAuthn and cryptographic TPM key binding.' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Online Payment Fraud', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Interception of card credentials and unverified merchant payouts.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TCRA Regulatory Escrow Sandbox holding funds 48h with cryptographic USSD push confirmation.' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Unauthorized Access Attempts', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Credential stuffing, brute-force attacks, and session hijacking.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SHA-256 salted password hashing, 15-minute JWT session expiration, and zero-trust firewall.' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SQLi, XSS & CSRF Attacks', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Malicious payload injection tampering with database records or user DOM.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parameterized wrapper sanitation stripping quotes and dangerous characters on every input.' })] })] })
                ]
              })
            ]
          }),

          // Chapter 2: TCP Integration
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '2. Trusted Computing Platform (TCP) Integration', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'Guided by the Trusted Computing Group (TCG, 2021) standards, the platform integrates core hardware and cryptographic attestation primitives. When a user or merchant interacts with the platform, the system measures platform integrity through Platform Configuration Registers (PCRs). The TCP Enclave validates trusted boot state and secures session tokens in isolated memory. All client-server channels enforce strict TLS 1.3 encryption, ensuring zero eavesdropping or man-in-the-middle (MitM) vectors during authentication or financial settlement.'
              })
            ]
          }),

          // Chapter 3: Biometric Authentication
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '3. Fingerprint Biometric Authentication Architecture (WebAuthn / FIDO2)', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'In alignment with NIST SP 800-63B guidelines, standard password authentication is reinforced with FIDO2 WebAuthn biometric challenges. During registration, the user’s physical device (Android Biometrics, iOS Touch ID, or laptop sensor) generates an ECDSA P-256 asymmetric cryptographic key pair. The private key never leaves the secure hardware enclave. Upon login or payment step-up, the server issues a randomized challenge buffer; the user confirms via fingerprint touch, generating a non-repudiable cryptographic signature (W3C WebAuthn Specification, 2023).'
              })
            ]
          }),

          // Chapter 4: Payment Simulation & Escrow
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '4. Simulated Payment API & TCRA Regulatory Escrow Gateway', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'To overcome severe consumer distrust toward regional online payments, the platform integrates a multi-tier payment simulator supporting Stripe Sandbox, PayPal Sandbox, and East African Mobile Money (M-Pesa, Tigo Pesa, Airtel Money). Crucially, the system implements a simulated Tanzania Communications Regulatory Authority (TCRA) Escrow protocol. Customer payments are held in a secure 48-hour consumer escrow account until delivery receipt is digitally attested, eliminating merchant non-delivery fraud.'
              })
            ]
          }),

          // Chapter 5: Trust Management
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '5. Trust Management Principles & Live Visual Indicators', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'Trust management requires transparent signaling of system trustworthiness. The application incorporates multi-layer trust indicators: prominent HTTPS lock emblems, hardware biometric trust seals, transparent TCRA Escrow guarantees, and a real-time interactive TCP Security & Telemetry Hub. Users and administrators can inspect real-time audit logs verifying that all input wrappers successfully block SQL Injection, XSS, and CSRF attacks.'
              })
            ]
          }),

          // Chapter 6: TAM and UTAUT
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '6. Technology Acceptance Model (TAM) & UTAUT Theoretical Implementation', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'To ensure high user adoption across East Africa, system engineering was strictly mapped to Davis (1989) Technology Acceptance Model (TAM) and Venkatesh et al. (2003) Unified Theory of Acceptance and Use of Technology (UTAUT):'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Perceived Usefulness (PU): ', bold: true }),
              new TextRun({ text: 'Accelerated 1-click biometric checkout and instant search filters drastically reduce shopping friction and task completion time.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Perceived Ease of Use (PEOU): ', bold: true }),
              new TextRun({ text: 'Intuitive bilingual support (English & Kiswahili), uncluttered navigation, and seamless touch-sensor logins eliminate cognitive overload.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'UTAUT Performance & Effort Expectancy: ', bold: true }),
              new TextRun({ text: 'Users experience instantaneous transaction feedback and zero password-fatigue thanks to WebAuthn key replacement.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'UTAUT Social Influence & Facilitating Conditions: ', bold: true }),
              new TextRun({ text: 'Verified buyer testimonials and universal responsive layout ensure flawless operation across desktop computers and low-cost smartphones.' })
            ]
          }),

          // Chapter 7: Screen Walkthroughs
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '7. System Screen Architecture & Functional Citations', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 200, line: 320 },
            children: [
              new TextRun({
                text: 'Below is the structured architectural documentation of the primary views implemented within the SmartTrade Africa system, demonstrating direct compliance with Course 428 objectives:'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Screen 1: Responsive Storefront Marketplace & Category Navigation', bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Citation: Satisfies Functional Requirement #2 (Product Management) and TAM PEOU (Clear navigation). Features real-time price conversion in Tanzanian Shillings (TSh), product descriptions, stock badges, and bilingual Swahili/English toggle.' })
            ]
          }),
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Screen 2: Secure Registration & Authentication Enclave Modal', bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Citation: Satisfies Functional Requirement #1 (User Authentication) and #7 (Security Requirements). Implements SHA-256 salted password handling, input wrapper sanitation against SQLi/XSS/CSRF, and direct WebAuthn hardware registration.' })
            ]
          }),
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Screen 3: FIDO2 WebAuthn Fingerprint Biometric Challenge Modal', bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Citation: Satisfies Functional Requirement #5 (Fingerprint Biometric Authentication). Triggers real platform WebAuthn hardware sensors or software TPM fallback with live cryptographic telemetry logs.' })
            ]
          }),
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Screen 4: Multi-Gateway TCRA Escrow Checkout Gateway', bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Citation: Satisfies Functional Requirement #3 (Payment API Integration) and #6 (Trust Management). Simulates USSD push approvals, SSL 256-bit encryption, and 48-hour regulatory escrow receipt attestation.' })
            ]
          }),

          // Chapter 8: References
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 500, after: 250 },
            children: [new TextRun({ text: '8. Academic References & Citations (APA Style)', bold: true, size: 26, color: '1E3A8A' })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319-340. https://doi.org/10.2307/249008' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'Grandison, T., & Sloman, M. (2000). A survey of trust in internet applications. IEEE Communications Surveys & Tutorials, 3(4), 2-16. https://doi.org/10.1109/COMST.2000.5340804' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'Trusted Computing Group. (2021). Trusted Platform Module (TPM) 2.0 Library Specification. TCG Architecture Specifications.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. MIS Quarterly, 27(3), 425-478. https://doi.org/10.2307/30036540' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'W3C Web Authentication Working Group. (2023). Web Authentication: An API for accessing Public Key Credentials Level 3. World Wide Web Consortium.' })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Course_428_SmartTrade_Africa_Final_Report.docx');
}
