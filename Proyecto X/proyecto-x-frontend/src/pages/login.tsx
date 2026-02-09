import { useMemo, useState } from 'react'

type FormState = {
	email: string
	password: string
	remember: boolean
}

type TouchedState = {
	email: boolean
	password: boolean
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
	const [form, setForm] = useState<FormState>({
		email: '',
		password: '',
		remember: true,
	})
	const [touched, setTouched] = useState<TouchedState>({
		email: false,
		password: false,
	})
	const [submitted, setSubmitted] = useState(false)

	const errors = useMemo(() => {
		const nextErrors: Partial<Record<keyof FormState, string>> = {}

		if (!form.email.trim()) {
			nextErrors.email = 'Ingresa tu correo.'
		} else if (!emailRegex.test(form.email.trim())) {
			nextErrors.email = 'Correo no valido.'
		}

		if (!form.password) {
			nextErrors.password = 'Ingresa tu clave.'
		} else if (form.password.length < 6) {
			nextErrors.password = 'Minimo 6 caracteres.'
		}

		return nextErrors
	}, [form.email, form.password])

	const hasErrors = Object.keys(errors).length > 0

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = event.target
		setForm((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const { name } = event.target
		setTouched((prev) => ({
			...prev,
			[name]: true,
		}))
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSubmitted(true)

		if (hasErrors) {
			setTouched({ email: true, password: true })
			return
		}

		// Placeholder: aqui se conectara el backend cuando este listo.
	}

	return (
		<div className="login">
			<div className="login__glow" aria-hidden="true" />
			<section className="login__panel login__panel--info">
				<div className="login__brand">Proyecto X</div>
				<h1>Accede a tu espacio operativo</h1>
				<p>
					Centraliza procesos, operaciones y reportes. Este login define el
					punto de entrada para equipos internos y socios.
				</p>
				<div className="login__stats">
					<div>
						<span>12</span>
						<small>modulos listos</small>
					</div>
					<div>
						<span>24/7</span>
						<small>visibilidad</small>
					</div>
					<div>
						<span>+90%</span>
						<small>trazabilidad</small>
					</div>
				</div>
			</section>
			<section className="login__panel login__panel--form">
				<div className="login__card">
					<div className="login__header">
						<p className="login__eyebrow">Bienvenido</p>
						<h2>Iniciar sesion</h2>
						<p className="login__subtitle">
							Usa tus credenciales corporativas para continuar.
						</p>
					</div>
					<form className="login__form" onSubmit={handleSubmit} noValidate>
						<label className="field">
							<span>Correo</span>
							<input
								type="email"
								name="email"
								placeholder="tu@empresa.com"
								value={form.email}
								onChange={handleChange}
								onBlur={handleBlur}
								aria-invalid={touched.email && !!errors.email}
							/>
							{touched.email && errors.email ? (
								<em className="field__error">{errors.email}</em>
							) : null}
						</label>
						<label className="field">
							<span>Clave</span>
							<input
								type="password"
								name="password"
								placeholder="Tu clave"
								value={form.password}
								onChange={handleChange}
								onBlur={handleBlur}
								aria-invalid={touched.password && !!errors.password}
							/>
							{touched.password && errors.password ? (
								<em className="field__error">{errors.password}</em>
							) : null}
						</label>
						<div className="login__row">
							<label className="checkbox">
								<input
									type="checkbox"
									name="remember"
									checked={form.remember}
									onChange={handleChange}
								/>
								<span>Recordarme</span>
							</label>
							<button type="button" className="link-button">
								Olvidaste tu clave?
							</button>
						</div>
						<button
							type="submit"
							className="login__submit"
							disabled={submitted && hasErrors}
						>
							Entrar
						</button>
						<div className="login__divider">
							<span>o</span>
						</div>
						<button type="button" className="login__ghost">
							Solicitar acceso
						</button>
					</form>
				</div>
			</section>
		</div>
	)
}

export default Login
