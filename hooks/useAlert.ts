import { Alert, Platform } from 'react-native';

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

export function useAlert() {
    const showAlert = (
        title: string,
        message?: string,
        buttons?: AlertButton[]
    ) => {
        if (Platform.OS === 'web') {
            // Para web, crear una experiencia más natural
            if (buttons && buttons.length > 0) {
                const confirmText = `${title}${message ? '\n\n' + message : ''}`;
                const confirmed = window.confirm(confirmText);

                if (confirmed) {
                    // Buscar el botón principal (no cancel)
                    const mainButton = buttons.find(b => b.style !== 'cancel') || buttons[0];
                    if (mainButton?.onPress) {
                        // Usar setTimeout para simular el comportamiento de Alert nativo
                        setTimeout(() => {
                            mainButton.onPress!();
                        }, 100);
                    }
                }
            } else {
                // Solo mostrar información
                window.alert(`${title}${message ? '\n\n' + message : ''}`);
            }
        } else {
            // Para mobile, usar Alert nativo
            Alert.alert(title, message, buttons);
        }
    };

    return { showAlert };
} 