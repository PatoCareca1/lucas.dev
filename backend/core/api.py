from ninja import NinjaAPI
import platform
import sys
from labs.api import router as labs_router
from bio.api import router as bio_router

api = NinjaAPI()
api.add_router("/labs", labs_router)
api.add_router("/bio", bio_router)


@api.get("/system-info")
def system_info(request):
    os_name = platform.system()
    if os_name == "Linux":
        try:
            # Attempt to read from freedesktop standard
            info = platform.freedesktop_os_release()
            os_name = info.get("PRETTY_NAME", "Linux")
        except:
            os_name = "Linux"

    return {"os": os_name, "python_version": sys.version.split(" ")[0]}
