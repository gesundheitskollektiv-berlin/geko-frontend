const backgroundClassMap = {
	white: 'bg-white',
	red: 'bg-geko-red',
	yellow: 'bg-geko-yellow',
	blue: 'bg-geko-blue',
	green: 'bg-geko-green'
};

/**
 * Turn Strapi landing content (dynamic zone) into something easier to iterate over.
 * @param {Array} content
 * @returns {Array<{ key: string, type: string, backgroundClass: string, data: object, anchor: string }>}
 */
export function mapLandingBlocks(content = []) {
	if (!Array.isArray(content)) return [];

	return content.map((block, idx) => {
		const type = block?.__component ?? 'unknown';
		return {
			key: block?.id ? `${type}-${block.id}` : `${type}-${idx}`,
			type,
			backgroundClass: getBackgroundClass(block?.background_color),
			anchor: getBlockAnchor(block),
			data: block
		};
	});
}

export function getBackgroundClass(color) {
	return backgroundClassMap[color] ?? backgroundClassMap.white;
}

export function getBlockAnchor(block) {
	if (block?.navbar_link && block?.navbar_link_title) {
		return slugify(block.navbar_link_title);
	}
	if (block?.title) {
		return slugify(block.title);
	}
	return '';
}

function slugify(value = '') {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9äöüß\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

