'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '../hooks/useDarkMode'

interface DemoHeaderProps {
  title: string
  subtitle: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
  showActions?: boolean
  actions?: React.ReactNode
}

interface StepConfig {
  number: number
  label: string
  icon: string
}

const DEMO_STEPS: StepConfig[] = [
  { number: 1, label: 'Datos', icon: '📝' },
  { number: 2, label: 'Scanner', icon: '📷' },
  { number: 3, label: 'Editor', icon: '🎨' },
  { number: 4, label: 'Carta', icon: '✨' }
]

export default function DemoHeader({ 
  title, 
  subtitle, 
  currentStep, 
  totalSteps, 
  onBack,
  showActions = false,
  actions 
}: DemoHeaderProps) {
  const router = useRouter()
  const { isDark, toggleTheme, themeIcon } = useDarkMode()
  
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'pending'
  }

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold'
      case 'active':
        return 'w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold'
      default:
        return 'w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-xs'
    }
  }

  const getStepTextStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-sm text-green-400'
      case 'active':
        return 'text-sm text-white font-medium'
      default:
        return 'text-sm text-gray-400'
    }
  }

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header Principal */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className={`w-8 h-8 ${isDark ? 'bg-yellow-500' : 'bg-blue-500'} rounded-full flex items-center justify-center text-sm transition-colors`}
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {themeIcon}
              </button>
              
              {showActions && actions}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="mb-2">
            <div className={`flex justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
              <span>Progreso del Setup</span>
              <span>{Math.round(progressPercentage)}% completado</span>
            </div>
            <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            {DEMO_STEPS.map((step) => {
              const status = getStepStatus(step.number)
              return (
                <div key={step.number} className="flex items-center space-x-2">
                  <div className={getStepStyles(status)}>
                    {status === 'completed' ? '✓' : step.number}
                  </div>
                  <span className={getStepTextStyles(status)}>
                    {step.number}. {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}