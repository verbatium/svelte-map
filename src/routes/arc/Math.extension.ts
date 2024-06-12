export function approximateAngle(s: number, c: number, tolerance: number): number {
  if (s === 0) return 0
  if (c === 0) return Math.PI * 2
  const k = c / s
  let theta_guess = Math.PI
  let delta = 1
  
  function first_derivative(theta_guess: number): number {
    const angle_half = theta_guess / 2
    return Math.cos(angle_half) / theta_guess - 2 * Math.sin(angle_half) / Math.pow(theta_guess, 2)
  }
  
  let i = 0
  while (Math.abs(delta) > tolerance) {
    i++
    const d = k - 2 * Math.sin(theta_guess / 2) / theta_guess
    const dx = first_derivative(theta_guess)
    delta = -d / dx
    console.log(delta)
    theta_guess = theta_guess - delta
  }
  console.log(i, 'iterations')
  return Math.round(theta_guess / tolerance) * tolerance
}