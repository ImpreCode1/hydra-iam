interface Platform {
  id: string
  name: string
  description: string
  image: string
}

export function PlatformCard({ platform }: { platform: Platform }) {

  return (

    <div className="card bg-white border hover:shadow-lg transition">

      <figure className="p-6">

        <img
          src={platform.image}
          alt={platform.name}
          className="h-20 object-contain"
        />

      </figure>

      <div className="card-body items-center text-center">

        <h2 className="card-title">
          {platform.name}
        </h2>

        <p className="text-sm text-gray-600">
          {platform.description}
        </p>

        <div className="card-actions mt-3">

          <button className="btn btn-primary btn-sm">
            Abrir
          </button>

        </div>

      </div>

    </div>

  )
}