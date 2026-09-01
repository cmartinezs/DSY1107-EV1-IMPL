package cl.duoc.dsy1107.aulatrack.web;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {
    @GetMapping("/public/info")
    public Map<String, Object> info() {
        return Map.of(
                "application", "AulaTrack",
                "api", "DSY1107 EV1 reference",
                "status", "ok"
        );
    }
}
