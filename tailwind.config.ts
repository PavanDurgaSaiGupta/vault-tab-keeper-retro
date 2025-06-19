
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'mono': ['JetBrains Mono', 'monospace'],
				'retro': ['VT323', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'neon-green': '#00ff41',
				'neon-cyan': '#00ffff',
				'terminal-green': '#39ff14',
				'dark-bg': '#0a0a0a',
				'dark-surface': '#111111',
				'dark-border': '#1a1a1a',
			},
			boxShadow: {
				'neon': '0 0 5px currentColor',
				'neon-lg': '0 0 20px currentColor',
				'glow': '0 0 10px rgba(0, 255, 65, 0.5)',
				'glow-cyan': '0 0 10px rgba(0, 255, 255, 0.5)',
			},
			keyframes: {
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'terminal-blink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				}
			},
			animation: {
				'matrix-rain': 'matrix-rain 3s linear infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'terminal-blink': 'terminal-blink 1s infinite'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
