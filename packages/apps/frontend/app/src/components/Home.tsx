import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RouteSearchForm from './RouteSearchForm'
import { RouteSearchData } from '../types/route'
import { ROUTES, ASSETS } from '../constants/app'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import { Badge } from './ui/Badge'
import { useTranslation } from '../hooks/useTranslation'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSearchTransporter = (data: RouteSearchData) => {
    const params = new URLSearchParams()
    if (data.departureCountry)
      params.append('departureCountry', data.departureCountry)
    if (data.departureCity) params.append('departureCity', data.departureCity)
    if (data.departureDate) params.append('departureDate', data.departureDate)
    if (data.arrivalCountry)
      params.append('arrivalCountry', data.arrivalCountry)
    if (data.arrivalCity) params.append('arrivalCity', data.arrivalCity)
    if (data.arrivalDate) params.append('arrivalDate', data.arrivalDate)

    navigate(`${ROUTES.searchResults}?${params.toString()}`)
  }

  const handleProposeRoute = () => {
    navigate(ROUTES.createRoute)
  }

  const features = [
    {
      icon: 'verified',
      titleKey: 'verifiedTransporters',
      descKey: 'verifiedTransportersDesc',
      color: 'text-success-600',
    },
    {
      icon: 'schedule',
      titleKey: 'fastDelivery',
      descKey: 'fastDeliveryDesc',
      color: 'text-primary-600',
    },
    {
      icon: 'security',
      titleKey: 'securePayment',
      descKey: 'securePaymentDesc',
      color: 'text-secondary-600',
    },
    {
      icon: 'support_agent',
      titleKey: 'support24_7',
      descKey: 'support24_7Desc',
      color: 'text-warning-600',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen pt-16 sm:pt-20 pb-[60px] sm:pb-[68px]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section with Search */}
        <div className="relative flex flex-col justify-center min-h-[calc(100vh-16rem)] sm:min-h-[calc(100vh-20rem)]">
          {/* Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${ASSETS.backgrounds.home}")`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 via-neutral-900/60 to-neutral-900/80" />
          </div>

          {/* Hero Content */}
          <Container size="lg" centered className="relative z-10 py-8 sm:py-12">
            {/* Hero Text */}
            <div className="text-center mb-8 sm:mb-12">
              <Badge
                variant="primary"
                size="md"
                className="mb-4 animate-pulse"
                icon={<Icon name="star" size="sm" filled />}
              >
                {t('platformNumber1')}
              </Badge>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                {t('findYourIdealTransporter')}
                <span className="block mt-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  {t('idealTransporter')}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto">
                {t('connectWithProfessionals')}
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-3xl mx-auto">
              <RouteSearchForm
                onSearch={handleSearchTransporter}
                onProposeRoute={handleProposeRoute}
              />
            </div>
          </Container>
        </div>

        {/* Features Section */}
        <section className="py-12 sm:py-20 bg-neutral-100 dark:bg-neutral-950">
          <Container size="lg" centered>
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                {t('whyChooseUs')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                {t('trustedPlatform')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  hoverable
                  className="text-center"
                >
                  <div
                    className={`flex items-center justify-center h-14 w-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                      feature.color === 'text-success-600'
                        ? 'from-success-500 to-success-600'
                        : feature.color === 'text-primary-600'
                          ? 'from-primary-500 to-primary-600'
                          : feature.color === 'text-secondary-600'
                            ? 'from-secondary-500 to-secondary-600'
                            : 'from-warning-500 to-warning-600'
                    } shadow-lg`}
                  >
                    <Icon
                      name={feature.icon}
                      size="xl"
                      filled
                      className="text-white"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                    {t(feature.titleKey as any)}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t(feature.descKey as any)}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}
