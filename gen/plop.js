import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 현재 파일의 경로를 얻습니다.
const __filename = fileURLToPath(import.meta.url)

// 현재 디렉토리의 경로를 얻습니다.
const __dirname = path.dirname(__filename)

export default function (plop) {
    plop.setGenerator('component', {
        description: 'Add a react component',
        async prompts(inquirer) {
            try {
                const ret1 = await inquirer.prompt(modulePathPrompt)
                const ret2 = await inquirer.prompt(groupPrompt)
                const ret3 = await inquirer.prompt(getNamePrompt(ret2.group))

                return {
                    modulePath: ret1.modulePath,
                    group: ret2.group,
                    name: ret3.name,
                }
            } catch (error) {
                console.log('error', error)
            }
        },
        actions(answers) {
            const actions = [
                {
                    type: 'add',
                    path: '../src/components/{{lowerCase group}}/{{pascalCase name}}/index.tsx',
                    templateFile: './comp/index.tsx.hbs',
                    abortOnFail: true,
                },
                {
                    type: 'add',
                    path: '../src/components/{{lowerCase group}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
                    templateFile: './comp/index.stories.tsx.hbs',
                    abortOnFail: true,
                },
                {
                    type: 'add',
                    path: '../src/components/{{lowerCase group}}/{{pascalCase name}}/{{kebabCase name}}.scss',
                    templateFile: './comp/index.scss.hbs',
                    abortOnFail: true,
                },
                {
                    type: 'modify',
                    path: '../src/components/index.ts',
                    pattern: /(\/\/ COMPONENT EXPORTS)/g,
                    template:
                        "export { default as {{pascalCase name}} } from './{{lowerCase group}}/{{pascalCase name}}'\n$1",
                },
            ]
            const msg = `import {{pascalCase name}} from '${urlSubfix}/{{lowerCase group}}/{{pascalCase name}}'`
            const renderedMsg = plop.renderString(msg, answers)

            console.log(getSuccessMsg(renderedMsg))
            return actions
        },
    })
}

const urlSubfix = '@components'
const getSuccessMsg = (renderedMsg) => {
    return `
  🎉  Your component was successfully created! 🎉

  Import it with:
  ${renderedMsg}
`
}
const modulePathPrompt = {
    type: 'input',
    name: 'modulePath',
    default: '@Next',
    message: 'What is your modules path?',
}

const groupPrompt = {
    type: 'input',
    name: 'group',
    message: 'In which module is your component?',
}
const getNamePrompt = (group) => ({
    type: 'input',
    name: 'name',
    message: 'what should it be called?',
    default: 'SimpleButton',
    validate: (value) => {
        if (/.+/.test(value)) {
            const path = `${group}/${value}`
            return moduleCompExists(path)
                ? 'A component with this name already exists'
                : true
        }

        return 'The name is required'
    },
})
const reactComps = fs.readdirSync(path.join(__dirname, '../src/components'))

export function moduleCompExists(comp) {
    return reactComps.indexOf(comp) >= 0
}
