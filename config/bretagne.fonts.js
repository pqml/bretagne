import { fontList as fonts } from '../src/utils/fontManager'

/*

	Les fonts sont à mettre dans le dossier fonts,
	Il faut un nom unique pour tout les formats.

	Formats à préparer:
		.eot
		.woff2
		.woff
		.ttf
		.svg

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
		.font('text', 'self-modern-text_trial')
		.font('regular', 'self-modern-regular_trial')
		.font('italic', 'self-modern-italic_trial')

	family('Résidence')
		.description(`
			Résidence description
		`)
		.font('regular', 'residence_trial')
})
