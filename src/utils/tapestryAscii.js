const chalk = require('chalk'); 
// console.log(chalk.hex('#9579fd') // purple
// console.log(chalk.hex('#29abe2') // teal
// console.log(chalk.hex('#29abe2')(text))
// log(chalk.blue('Hello') + ' World' + chalk.red('!'));
function tapestryAscii() {
  console.log(chalk.hex('#9579fd')(`,,,,,,,, `) + chalk.hex('#29abe2')(`   ,╓╓╓╓╓╓╓╓`));
  console.log(chalk.hex('#9579fd')(`▒        ,\`=,`));
  console.log(chalk.hex('#9579fd')(` \`\`\`\`\`\`\``) + chalk.hex('#29abe2')(` ╔╜`)+ chalk.hex('#9579fd')(`,`) + chalk.hex('#29abe2')(` φ╙╙""""""@`));
  console.log(chalk.hex('#9579fd')(`≥≥≥≥≥≥≥≡\` ╘ε  ε`) + chalk.hex('#29abe2')(`≤εεεεε╚`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`) + chalk.hex('#29abe2')(`                                         ╓`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`) + chalk.hex('#29abe2')(`     ,╓╦╓    ╓ ,╓╦╓     ,╓╔╓     ╓╓╦╓   ╓╚╦╓  . ,╓╕.,      ╓`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`) + chalk.hex('#29abe2')(`    ╩    ╚ε  ╚╜    ╠   ╬    ╙≥  ╬    ╚⌐  ╚b    ▐╩    ╠    ╔╙`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`) + chalk.hex('#29abe2')(`    ,╔εª≈φΓ  ╚      ╬ ▐δMMMMM╩  \`²≥╦╓    ╚b    ▐⌐     ╬  ]╩`));
  console.log(chalk.hex('#9579fd')(`        Γ  Γ  Γ`) + chalk.hex('#29abe2')(`   ]Γ    ]Γ  ╚     ▐Γ └▒       .     ╚ε  ╚b    ▐⌐      ╬ ╬`));
  console.log(chalk.hex('#9579fd')(`        ⁿ≥≥   ╛`) + chalk.hex('#29abe2')(`    ╙≥╦εΘ╙δ  ╚╜≈εσM╙    ╙ε╦εM   ╙M╦╔#╜    δ╦ε  ╘⌐      ╙╠`));
  console.log(chalk.hex('#9579fd')(`               `) + chalk.hex('#29abe2')(`             ╚                                         φ`));
  console.log(chalk.hex('#9579fd')(`               `) + chalk.hex('#29abe2')(`             ╚                                       "╙`));
  console.log(chalk.hex('#9579fd') (`              `) + chalk.hex('#29abe2')(`              \`                                      \``));
}

// export default tapestryAscii();
module.exports = tapestryAscii;