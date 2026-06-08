const bcrypt = require('bcryptjs')
const { createClient } = require('@libsql/client')

const NEW_PASSWORD = 'Admin@123'
const ADMIN_EMAIL = 'ks005164@gmail.com'

async function resetPassword() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 10)
  const db = createClient({ url: 'file:./payload.db' })
  const result = await db.execute(
    'UPDATE users SET hash = ? WHERE email = ?',
    [hash, ADMIN_EMAIL]
  )
  console.log('✅ Password reset successful!')
  console.log('   Email:', ADMIN_EMAIL)
  console.log('   New Password: Admin@123')
  console.log('   Rows updated:', result.rowsAffected)
  db.close()
}

resetPassword().catch(console.error)
