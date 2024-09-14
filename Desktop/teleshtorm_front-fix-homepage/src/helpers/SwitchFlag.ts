export const switchFlag = (locale: string) => {
    switch (locale) {
      case 'en':
        return '/English.svg'
      case 'de':
        return "/Deutsch.svg"
      case 'ru':
        return "/Russian.svg"
        case 'es':
        return '/Español.svg'
      case 'fr':
        return "/Français.svg"
      case 'it':
        return "/Italiano.svg"
        case 'pt':
          return "/Portugal.svg"
    }
  }