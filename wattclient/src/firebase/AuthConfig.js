import * as fb from 'firebase/app'

const uiConfig = ({
    signInOptions: [{
        provider: fb.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: [
            'profile',
            'email',
        ],
        customParameters: {hd: 'pausd.us'}
    }],
    tosUrl: '/about/tos',
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
})

export default uiConfig
