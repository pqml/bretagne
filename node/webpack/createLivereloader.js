export default function createLiveReloader( server ) {

	return function () {

		server.sockWrite( server.sockets, 'content-changed' );

	};

}
