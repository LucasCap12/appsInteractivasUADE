import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BrowsingHistoryContext } from '../context/BrowsingHistoryContext';
import { useNotification } from '../context/NotificationContext';

const BrowsingHistory = () => {
  const { history, clearHistory, removeFromHistory } = useContext(BrowsingHistoryContext);
  const { confirm } = useNotification();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace unos segundos';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleClearAll = async () => {
    const confirmed = await confirm('¿Estás seguro de que quieres borrar todo tu historial de navegación?');
    if (confirmed) {
      clearHistory();
    }
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-lg p-12 text-center transition-colors duration-300">
            <div className="text-6xl mb-6">🕐</div>
            <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
              Tu historial está vacío
            </h1>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-8 max-w-md mx-auto">
              A medida que explores productos, verás aquí los últimos 10 que visitaste para que puedas encontrarlos fácilmente.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Empezar a explorar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                Historial de navegación
              </h1>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Tus últimos {history.length} producto{history.length !== 1 ? 's' : ''} visitado{history.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Borrar historial
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 transition-colors duration-300">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Guardamos los últimos 10 productos que visitaste. El historial se almacena localmente en tu navegador.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((product) => (
            <div
              key={product.id}
              className="bg-surface dark:bg-surface-dark rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromHistory(product.id);
                }}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Quitar del historial"
              >
                ×
              </button>

              <Link to={`/producto/${product.id}`} className="block">
                {/* Image */}
                <div className="relative h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={product.imagen || '/placeholder.svg'}
                    alt={`Imagen de ${product.nombre}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder.svg';
                      e.target.alt = 'Imagen no disponible';
                    }}
                  />
                  
                  {/* Visited time overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-3">
                    {formatDate(product.visitedAt)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.nombre}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-text-secondary dark:text-text-dark-secondary mb-3">
                    {product.categoria && (
                      <p className="flex items-center gap-1">
                        <span className="text-gray-400">📂</span>
                        {product.categoria}
                      </p>
                    )}
                    {product.vendedor && (
                      <p className="flex items-center gap-1">
                        <span className="text-gray-400">👤</span>
                        {product.vendedor}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${product.precio?.toFixed(2)}
                    </span>
                    <span className="text-sm text-primary font-semibold">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info */}
        {history.length === 10 && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors duration-300">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Has alcanzado el límite de 10 productos. Los productos más antiguos se reemplazarán automáticamente cuando visites nuevos productos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsingHistory;
