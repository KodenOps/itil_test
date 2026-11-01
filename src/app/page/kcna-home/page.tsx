"use client";

import CourseLessonPage, {
  type CourseCard,
  type LessonCategory,
} from "@/app/components/CourseLessonPage";
import { MdOutlineQuiz, MdOutlinePlaylistAdd } from "react-icons/md";

const categories: LessonCategory[] = [
  {
    id: "fundamentals",
    title: "Kubernetes Fundamentals",
    description:
      "What Kubernetes is for, how a cluster is put together, and why everything in it is declared rather than installed.",
    accentFrom: "#26a465",
    accentTo: "#39c682",
    accentHex: "#26a465",
    lessons: [
      {
        id: "why-kubernetes",
        title: "Why Kubernetes Exists",
        body: "Kubernetes is a container orchestrator: it schedules containers onto machines, restarts them when they fail, gives them stable network identities and scales them with demand. Before orchestration, running containers in production meant writing scripts to start processes, health-check them and rebalance them across hosts.\n\nThe problem it solves is not 'run a container' but 'run hundreds of containers across many machines, survive failures, and deploy new versions without downtime'. That framing is what the KCNA exam builds on throughout: Kubernetes is about declaring a desired state and letting controllers close the gap.",
        takeaway:
          "Kubernetes keeps a cluster at a declared desired state; controllers do the reconciling.",
      },
      {
        id: "architecture",
        title: "Cluster Architecture",
        body: "A cluster has a control plane and worker nodes. The control plane runs the API server (the only component anything talks to), etcd (the key-value store holding all cluster state), the scheduler (assigns pods to nodes) and the controller manager (runs reconciliation loops).\n\nWorker nodes run the kubelet, which talks to the API server and manages pods on its node, the container runtime, and kube-proxy, which implements service networking rules. If etcd is lost, the cluster's state is lost — which is why backing it up is a classic operational concern.",
        takeaway:
          "API server is the front door, etcd holds state, scheduler places pods, kubelet runs them on nodes.",
        table: {
          header: ["Component", "Runs on", "Job"],
          rows: [
            ["kube-apiserver", "Control plane", "Single entry point for all requests"],
            ["etcd", "Control plane", "Stores the entire cluster state"],
            ["kube-scheduler", "Control plane", "Assigns new pods to nodes"],
            ["controller-manager", "Control plane", "Reconciles actual state with desired"],
            ["kubelet", "Worker node", "Starts and monitors pods on its node"],
            ["kube-proxy", "Worker node", "Implements service network rules"],
          ],
        },
      },
      {
        id: "declarative-model",
        title: "Objects and the Declarative Model",
        body: "Everything in Kubernetes is an API object described in YAML or JSON: pods, deployments, services, config maps, secrets, namespaces and more. You submit an object to the API server, it is stored in etcd, and controllers work continuously to make the real world match it.\n\nImperative commands such as kubectl run create or change one thing immediately; declarative manifests applied with kubectl apply describe the end state. GitOps workflows build on the declarative model: the repository is the source of truth, and a controller syncs the cluster to it.",
        takeaway:
          "You declare objects; controllers reconcile. kubectl apply is idempotent, which is what makes GitOps possible.",
      },
    ],
  },
  {
    id: "workloads",
    title: "Workloads and Scheduling",
    description:
      "Pods, controllers, services and configuration — the objects you spend most of your day with.",
    accentFrom: "#2660A4",
    accentTo: "#4F8FCA",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "pods",
        title: "Pods",
        body: "A pod is the smallest deployable unit: one or more containers that share a network namespace, IP address and storage volumes. Containers in the same pod reach each other over localhost, which is why sidecar patterns such as a log shipper or proxy work.\n\nPods are ephemeral by design. They are not restarted in place when a node dies; a controller creates a replacement, which is why you rarely create bare pods in production. Each pod also gets a lifecycle: pending, running, succeeded or failed, with restart policies controlling what happens to exited containers.",
        takeaway:
          "Pods share a network namespace and are disposable. Use a controller, not bare pods, for real workloads.",
      },
      {
        id: "controllers",
        title: "Deployments, ReplicaSets and StatefulSets",
        body: "A ReplicaSet makes sure a number of identical pods are running. A Deployment manages ReplicaSets and adds rolling updates and rollbacks, which is the normal way to run stateless applications. A DaemonSet runs one pod per node, for agents such as log collectors or network plugins.\n\nA StatefulSet gives each pod a stable identity and its own persistent volume, which is what stateful services like databases need. A Job runs pods to completion and a CronJob runs them on a schedule. Choosing the right controller is mostly about identity and lifecycle requirements.",
        takeaway:
          "Deployment for stateless services, StatefulSet for stable identity, DaemonSet per node, Job for run-to-completion.",
      },
      {
        id: "services-networking",
        title: "Services and Ingress",
        body: "Pods come and go, so their IPs are not stable. A Service gives a stable virtual IP and DNS name that load-balances across the pods matching its selector. ClusterIP exposes it inside the cluster, NodePort opens a port on every node, and LoadBalancer asks the cloud provider for an external load balancer.\n\nIngress works at layer 7 and routes HTTP host and path rules to services through an ingress controller, so many services can share one external entry point. A NetworkPolicy, where the CNI supports it, restricts which pods may talk to which — default-deny plus explicit allows is the secure baseline.",
        takeaway:
          "Services give stable access to moving pods; Ingress adds HTTP routing; NetworkPolicies restrict pod traffic.",
      },
      {
        id: "config",
        title: "ConfigMaps, Secrets and Scheduling Controls",
        body: "ConfigMaps hold non-sensitive configuration and Secrets hold sensitive values, both injected as environment variables or mounted files so the same image runs in every environment. Secrets are base64-encoded by default, not encrypted at rest unless you enable encryption, which is a common exam distinction.\n\nScheduling is steered with labels and selectors, node selectors, affinity and anti-affinity rules, taints on nodes and tolerations on pods, plus resource requests and limits. Requests determine placement and guarantees; limits cap usage. Missing requests are the usual cause of a pod that schedules onto a node without enough capacity.",
        takeaway:
          "ConfigMaps and Secrets externalise configuration. Requests drive scheduling, limits cap usage, taints repel pods.",
      },
    ],
  },
  {
    id: "cloud-native",
    title: "Cloud Native Architecture",
    description:
      "How cloud-native systems are shaped, scaled, observed and kept healthy in production.",
    accentFrom: "#7A4DFF",
    accentTo: "#4F7CFF",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "microservices",
        title: "Microservices and the Twelve-Factor App",
        body: "Cloud-native architecture favours small, independently deployable services with clear boundaries, communicating over APIs or events rather than sharing a database. This buys independent scaling and release cadence at the cost of distributed complexity — retries, timeouts and observability stop being optional.\n\nThe twelve-factor app describes the operational discipline behind this: configuration in the environment, stateless processes, explicit dependencies, logs as event streams, and disposability. Kubernetes enforces much of it by design, since pods are replaced rather than patched.",
        takeaway:
          "Small services with independent deploys scale better but demand disciplined configuration, statelessness and observability.",
      },
      {
        id: "autoscaling",
        title: "Autoscaling and Resilience",
        body: "The Horizontal Pod Autoscaler adds or removes pod replicas based on observed metrics such as CPU utilisation or custom metrics. The Vertical Pod Autoscaler adjusts requests and limits instead, and the Cluster Autoscaler (or a managed equivalent) adds nodes when pods cannot be scheduled.\n\nResilience comes from spreading replicas across nodes and zones, setting readiness probes so traffic only reaches pods that can serve it, liveness probes so stuck containers restart, and disruption budgets so voluntary operations cannot take a service down. Probe misconfiguration is one of the most common production failure modes.",
        takeaway:
          "HPA scales pods, Cluster Autoscaler scales nodes. Readiness gates traffic, liveness restarts, budgets protect availability.",
      },
      {
        id: "observability",
        title: "Observability: Metrics, Logs and Traces",
        body: "Cloud-native observability has three signals: metrics for aggregates over time, logs for discrete events, and traces for the path of one request across services. Kubernetes exposes cluster and container metrics, while applications emit their own.\n\nIn the CNCF ecosystem, Prometheus is the de facto metrics system with alerting through Alert Manager, Grafana visualises, Fluent Bit and Loki handle logs, and OpenTelemetry is the emerging standard for instrumentation. The point of all three signals is to answer 'is it healthy?' and 'why is this one request slow?' without redeploying anything.",
        takeaway:
          "Metrics, logs and traces answer different questions — a healthy platform needs all three, ideally via OpenTelemetry.",
      },
    ],
  },
  {
    id: "security",
    title: "Security and the Ecosystem",
    description:
      "Access control, runtime protection, supply chain safety and the CNCF landscape that surrounds Kubernetes.",
    accentFrom: "#6D2E46",
    accentTo: "#9B4D57",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "authn-authz",
        title: "Authentication and RBAC",
        body: "Authentication proves who is calling the API server: client certificates, bearer tokens, OIDC identity providers or service account tokens. Service accounts give pods an identity so they can call the API with scoped permissions.\n\nAuthorization is usually role-based access control. A Role defines permissions inside a namespace and a ClusterRole defines them cluster-wide; a RoleBinding or ClusterRoleBinding grants them to a subject. Least privilege plus namespaces is the practical containment strategy, and the default service account should never hold broad permissions.",
        takeaway:
          "Authentication identifies the caller; RBAC grants permissions through roles and bindings. Keep service accounts minimal.",
      },
      {
        id: "runtime-security",
        title: "Runtime and Network Security",
        body: "Containers are not a security boundary by themselves. Running as non-root, using read-only root filesystems, dropping Linux capabilities and applying seccomp or AppArmor profiles all reduce what a compromised container can do.\n\nNetwork policies limit lateral movement, secrets should be mounted rather than committed into images, and admission controllers such as Open Policy Agent Gatekeeper or Kyverno enforce rules before an object is ever created. Image scanning in the pipeline catches known vulnerabilities before they reach a node.",
        takeaway:
          "Harden the container, restrict the network, scan the image and enforce policy at admission control.",
        bullets: [
          "Run as non-root with a read-only root filesystem where possible",
          "Apply NetworkPolicies so pods only reach what they need",
          "Never bake secrets into images — mount them instead",
          "Enforce policy at admission with OPA Gatekeeper or Kyverno",
          "Scan images in CI and sign them for supply chain integrity",
        ],
      },
      {
        id: "ecosystem",
        title: "The CNCF Ecosystem",
        body: "The Cloud Native Computing Foundation hosts the projects that orbit Kubernetes. Graduated projects include Kubernetes, Prometheus, Envoy, containerd, Helm, Fluentd, Jaeger, Vitess, Argo and etcd — mature, widely adopted and production-proven.\n\nAround them sit the practical tools of daily work: Helm and Kustomize for packaging and templating manifests, Argo CD and Flux for GitOps delivery, Istio and Linkerd for service mesh concerns such as mTLS and traffic shifting, and Cilium or Calico for networking and policy. Knowing which layer a tool solves is the point, not memorising the full landscape.",
        takeaway:
          "Know each project's layer: packaging (Helm), delivery (Argo/Flux), mesh (Istio/Linkerd), networking (Cilium/Calico).",
      },
    ],
  },
];

const cards: CourseCard[] = [
  {
    href: "/page/kcna-exam",
    label: "Exam Mode",
    description:
      "Sit a timed, full-length KCNA-style assessment and get a scored result at the end.",
    icon: <MdOutlineQuiz size={36} />,
    accentFrom: "#2660A4",
    accentTo: "#4F8FCA",
  },
  {
    href: "/page/kcna-practice",
    label: "Practice Mode",
    description:
      "Work section by section through the KCNA question bank without the clock.",
    icon: <MdOutlinePlaylistAdd size={36} />,
    accentFrom: "#26a465",
    accentTo: "#39c682",
  },
];

export default function Page() {
  return (
    <CourseLessonPage
      badge='KCNA learning path'
      title='Kubernetes and cloud-native, explained for the exam room.'
      intro='The KCNA syllabus in reading order: fundamentals, workloads and scheduling, cloud-native architecture, then security and ecosystem. Read a section here, then open exam mode at the bottom of the page to test the same material.'
      meta={["KCNA syllabus", "4 sections", "13 lessons", "Exam + practice"]}
      categories={categories}
      practiceNote='Both modes draw from the same KCNA question bank, so a low section score tells you which lesson above to revisit.'
      cards={cards}
    />
  );
}
