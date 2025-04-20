import React, { useMemo } from 'react'
import { Card, Typography, Button, Space, message } from 'antd'
import {
  DownloadOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

// Color scheme constants
const colors = {
  primary: '#1e4d8c', // Deep navy blue
  secondary: '#6096ba', // Medium blue
  accent: '#a3cef1', // Light blue
  light: '#e1eefb', // Very light blue
  dark: '#0c2340', // Very dark blue
  text: '#333333', // Dark text
  textLight: '#666666', // Light text
  background: '#f8fafd', // Off-white with blue tint
}

// Premium modern certificate styles with blue color scheme
const certificateStyle = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
  },
  certificate: {
    width: '100%',
    maxWidth: '900px',
    aspectRatio: '1.414 / 1', // A4 landscape ratio
    padding: 0,
    background: '#ffffff',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  // Use grid layout to ensure proper spacing and placement
  certificateContent: {
    position: 'relative',
    height: '100%',
    background: `linear-gradient(to right, #ffffff 0%, ${colors.background} 100%)`,
    padding: '30px',
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto auto', // Header, title, content, signatures, footer
    gridGap: '5px',
    boxSizing: 'border-box',
  },
  goldenBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: '12px',
    borderStyle: 'solid',
    borderImage: `linear-gradient(45deg, ${colors.primary} 0%, ${colors.secondary} 100%) 1`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  innerBorder: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    bottom: '12px',
    border: `1px solid ${colors.accent}`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  cornerAccent: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.accent,
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    marginBottom: '5px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
    filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
    color: colors.primary,
  },
  organizationName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: colors.dark,
  },
  certIdSection: {
    textAlign: 'right',
  },
  certIdLabel: {
    fontSize: '12px',
    color: colors.textLight,
    display: 'block',
    marginBottom: '2px',
  },
  certId: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: colors.secondary,
    letterSpacing: '1px',
  },
  titleContainer: {
    marginBottom: '15px',
    textAlign: 'center',
    position: 'relative',
  },
  goldDivider: {
    height: '2px',
    background: `linear-gradient(90deg, rgba(30, 77, 140, 0), rgba(30, 77, 140, 0.6), rgba(30, 77, 140, 0))`,
    width: '80%',
    margin: '0 auto 15px',
  },
  titleText: {
    fontSize: '32px',
    fontWeight: 300, // Light weight for modern look
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '5px',
  },
  subtitleText: {
    fontSize: '14px',
    color: colors.textLight,
    letterSpacing: '1px',
  },
  // Content section with scrolling if needed
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'auto', // Allow scrolling if content is too large
    padding: '0 20px',
    position: 'relative',
    zIndex: 2,
  },
  recipientSection: {
    textAlign: 'center',
    margin: '10px 0 20px',
  },
  presentTo: {
    fontSize: '16px',
    color: colors.textLight,
    marginBottom: '10px',
  },
  recipientName: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '20px',
    position: 'relative',
    display: 'inline-block',
    padding: '0 15px',
  },
  nameUnderline: {
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, rgba(30, 77, 140, 0), rgba(30, 77, 140, 0.6), rgba(30, 77, 140, 0))`,
  },
  courseSection: {
    textAlign: 'center',
    margin: '0 0 10px',
  },
  forText: {
    fontSize: '16px',
    color: colors.textLight,
    marginBottom: '10px',
  },
  courseTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '10px',
  },
  courseDescription: {
    fontSize: '14px',
    color: colors.textLight,
    maxWidth: '80%',
    margin: '0 auto',
    lineHeight: '1.4',
  },
  // Fixed position signatures section
  signaturesSection: {
    display: 'flex',
    justifyContent: 'space-evenly',
    borderTop: `1px solid ${colors.accent}`,
    marginTop: '10px',
    paddingTop: '15px',
    position: 'relative',
    zIndex: 3,
  },
  signatureBlock: {
    textAlign: 'center',
    width: '180px',
  },
  signatureLine: {
    height: '1px',
    width: '100%',
    background: `linear-gradient(90deg, rgba(30, 77, 140, 0.1), rgba(30, 77, 140, 0.6), rgba(30, 77, 140, 0.1))`,
    marginBottom: '5px',
  },
  signatureText: {
    fontFamily: "'Tangerine', cursive",
    fontSize: '24px',
    color: colors.text,
    marginBottom: '5px',
    height: '30px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  signatureTitle: {
    fontSize: '11px',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  // Footer section
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    marginTop: '5px',
  },
  dateSection: {
    textAlign: 'left',
  },
  issuedOn: {
    fontSize: '11px',
    color: colors.textLight,
    marginBottom: '2px',
  },
  dateText: {
    fontSize: '13px',
    color: colors.text,
  },
  qrSection: {
    textAlign: 'right',
  },
  qrCode: {
    fontSize: '36px',
    color: colors.secondary,
  },
  verifyText: {
    fontSize: '10px',
    color: colors.textLight,
    marginTop: '2px',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '300px',
    color: `rgba(30, 77, 140, 0.03)`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    width: '80px',
    height: '80px',
    opacity: 0.7,
    zIndex: 1,
  },
  badgeInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  badgeCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: `2px solid ${colors.accent}`,
    borderRadius: '50%',
  },
  badgeIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '36px',
    color: colors.secondary,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
    width: '100%',
    maxWidth: '900px',
  },
  actionButton: {
    height: '44px',
    padding: '0 24px',
    fontSize: '16px',
    borderRadius: '4px',
  },
  primaryButton: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    borderColor: colors.primary,
  },
}

const CertificateView = ({
  courseId,
  courseName = 'Professional Development Course',
  userName = 'John Doe',
  completionDate = 'November 15, 2023',
}) => {
  // Generate a unique certificate ID
  const certificateId = useMemo(() => {
    // Combine course ID and timestamp for uniqueness
    const timestamp = new Date().getTime().toString(36).toUpperCase()
    return `CERT-${courseId || '001'}-${timestamp.slice(-6)}`
  }, [courseId])

  const handleDownload = () => {
    message.success('Certificate downloaded successfully')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={certificateStyle.container}>
      <Card
        style={certificateStyle.certificate}
        id="certificate-card"
        bodyStyle={{ height: '100%', padding: 0 }}
      >
        <div style={certificateStyle.certificateContent}>
          <div style={certificateStyle.goldenBorder}></div>
          <div style={certificateStyle.innerBorder}></div>

          <div
            style={{
              ...certificateStyle.cornerAccent,
              top: '20px',
              left: '20px',
              borderRight: 'none',
              borderBottom: 'none',
            }}
          ></div>
          <div
            style={{
              ...certificateStyle.cornerAccent,
              top: '20px',
              right: '20px',
              borderLeft: 'none',
              borderBottom: 'none',
            }}
          ></div>
          <div
            style={{
              ...certificateStyle.cornerAccent,
              bottom: '20px',
              left: '20px',
              borderRight: 'none',
              borderTop: 'none',
            }}
          ></div>
          <div
            style={{
              ...certificateStyle.cornerAccent,
              bottom: '20px',
              right: '20px',
              borderLeft: 'none',
              borderTop: 'none',
            }}
          ></div>

          {/* Watermark */}
          <div style={certificateStyle.watermark}>
            <SafetyCertificateOutlined />
          </div>

          {/* Header - First grid row */}
          <div style={certificateStyle.header}>
            <div style={certificateStyle.logoSection}>
              <SafetyCertificateOutlined style={certificateStyle.logoImg} />
              <Title level={5} style={certificateStyle.organizationName}>
                ORIENTATION TRAINING ACADEMY
              </Title>
            </div>

            <div style={certificateStyle.certIdSection}>
              <Text style={certificateStyle.certIdLabel}>CERTIFICATE ID</Text>
              <Text style={certificateStyle.certId}>{certificateId}</Text>
            </div>
          </div>

          {/* Title section - Second grid row */}
          <div style={certificateStyle.titleContainer}>
            <div style={certificateStyle.goldDivider}></div>
            <Title level={1} style={certificateStyle.titleText}>
              Certificate of Completion
            </Title>
            <Text style={certificateStyle.subtitleText}>
              PROFESSIONAL ACHIEVEMENT & RECOGNITION
            </Text>
            <div style={certificateStyle.goldDivider}></div>
          </div>

          {/* Main content - Third grid row (flexible) */}
          <div style={certificateStyle.contentSection}>
            {/* Recipient section */}
            <div style={certificateStyle.recipientSection}>
              <Text style={certificateStyle.presentTo}>
                This certifies that
              </Text>
              <div style={certificateStyle.recipientName}>
                {userName}
                <div style={certificateStyle.nameUnderline}></div>
              </div>
            </div>

            {/* Course section */}
            <div style={certificateStyle.courseSection}>
              <Text style={certificateStyle.forText}>
                has successfully completed
              </Text>
              <Title level={3} style={certificateStyle.courseTitle}>
                {courseName}
              </Title>
              <Paragraph style={certificateStyle.courseDescription}>
                Having demonstrated the necessary skills and knowledge required
                by the program, this individual has shown commitment to
                professional development.
              </Paragraph>
            </div>
          </div>

          {/* Signatures section - Fourth grid row */}
          <div style={certificateStyle.signaturesSection}>
            <div style={certificateStyle.signatureBlock}>
              <div style={certificateStyle.signatureText}>Dao Minh Nhat</div>
              <div style={certificateStyle.signatureLine}></div>
              <Text style={certificateStyle.signatureTitle}>Trainee</Text>
            </div>

            <div style={certificateStyle.signatureBlock}>
              <div style={certificateStyle.signatureText}>{userName}</div>
              <div style={certificateStyle.signatureLine}></div>
              <Text style={certificateStyle.signatureTitle}>
                Course Creator
              </Text>
            </div>
          </div>

          {/* Footer - Fifth grid row */}
          <div style={certificateStyle.footer}>
            <div style={certificateStyle.dateSection}>
              <Text style={certificateStyle.issuedOn}>ISSUED ON</Text>
              <Text style={certificateStyle.dateText}>{completionDate}</Text>
            </div>

            <div style={certificateStyle.qrSection}>
              <QrcodeOutlined style={certificateStyle.qrCode} />
              <Text style={certificateStyle.verifyText}>
                Scan to verify certificate
              </Text>
            </div>
          </div>

          {/* Certificate badge */}
          <div style={certificateStyle.badge}>
            <div style={certificateStyle.badgeInner}>
              <div style={certificateStyle.badgeCircle}></div>
              <CheckCircleFilled style={certificateStyle.badgeIcon} />
            </div>
          </div>
        </div>
      </Card>

      <div style={certificateStyle.actions}>
        <Space size="large">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            style={{
              ...certificateStyle.actionButton,
              ...certificateStyle.primaryButton,
            }}
            onClick={handleDownload}
          >
            Download Certificate
          </Button>
          <Button
            icon={<PrinterOutlined />}
            size="large"
            style={certificateStyle.actionButton}
            onClick={handlePrint}
          >
            Print Certificate
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default CertificateView
