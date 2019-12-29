/* eslint-disable */
import { fontList as fonts } from '../src/utils/fontManager'

/*

	Les fonts sont à mettre dans le dossier static/fonts,
	Il faut un nom unique pour tout les formats.

	Formats à préparer:
		.woff2
		.woff

	family('Nom de la famille')
		.description('Texte d'info sur la famille')
		.font('Nom de la font', 'id de la font dans le dossier fonts')

*/

export default fonts(family => {


	family('Self Modern')
		.description(`
			Des spécimens de caractères traditionnels japonais « Mincho »
			trouvés dans des revues, des livres, ramenés du Japon en 2015
			ont servi de base au dessin.
			Se sont ajoutées à ces références des recherches sur les systèmes
			de composition automatique, les « Self Spacing Types » notamment.
			La graisse a ensuite été étudiée pour fonctionner avec les
			caractères japonais à taille équivalente.
		`)
		.font('text', 'self-modern_text_web-webfont')
		.font('regular', 'self_modern_web-webfont')
		.font('italic', 'self_modern_italic_web-webfont')


	family('Cucina')
		.description(`
			Des spécimens de caractères traditionnels japonais « Mincho »
			trouvés dans des revues, des livres, ramenés du Japon en 2015
			ont servi de base au dessin.
			Se sont ajoutées à ces références des recherches sur les systèmes
			de composition automatique, les « Self Spacing Types » notamment.
			La graisse a ensuite été étudiée pour fonctionner avec les
			caractères japonais à taille équivalente.
		`)
		.font('neretta', 'bretagne_cucina_web-webfont')
		.font('corsiva', 'bretagne_cucina-corsiva_web-webfont')


	family('Happy Times at the IKOB New Game Plus Edition')
		.noLineBreak()
		.description(`
			Des spécimens de caractères traditionnels japonais « Mincho »
			trouvés dans des revues, des livres, ramenés du Japon en 2015
			ont servi de base au dessin.
			Se sont ajoutées à ces références des recherches sur les systèmes
			de composition automatique, les « Self Spacing Types » notamment.
			La graisse a ensuite été étudiée pour fonctionner avec les
			caractères japonais à taille équivalente.
		`)
		.font('regular', 'happy-times-ng_regular_master-webfont')
		.font('italic', 'happy-times-ng_italic_master-webfont')
		.font('bold', 'happy-times-ng_bold_master-webfont')


})
